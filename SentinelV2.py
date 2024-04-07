import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.callbacks import Callback
from tensorflow.keras.utils import to_categorical

# Load the dataset
data = pd.read_csv('security_headers_report.csv')
X = data[['CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'HSTS', 'X-XSS-Protection']]  # Feature columns
y = to_categorical(data['SecurityScore'])  # Target column

# Split and scale the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define the neural network model
model = Sequential([
    Dense(12, input_shape=(X_train_scaled.shape[1],), activation='relu'),
    Dense(8, activation='relu'),
    Dense(3, activation='softmax')  # 3 categories: Green, Yellow, Red
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Custom callback to save the model periodically
class ModelCheckpointImproved(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if epoch % 700 == 0:
            filename = f'model_epoch_{epoch}_acc_{logs["accuracy"] * 100:.2f}.h5'
            model.save(filename)
            print(f'\nModel saved: {filename}')

# Train the model
model.fit(X_train_scaled, y_train, epochs=3500, validation_data=(X_test_scaled, y_test), callbacks=[ModelCheckpointImproved()])

# Final evaluation
final_loss, final_accuracy = model.evaluate(X_test_scaled, y_test)
print(f'\nFinal model accuracy: {final_accuracy * 100:.2f}%')

# Predict and display security classification for each website in the test set
predictions = model.predict(X_test_scaled)
predicted_categories = np.argmax(predictions, axis=1)

# Mapping numeric categories back to color labels
category_labels = ['Green - Good', 'Yellow - Alert, but not a threat', 'Red - A threat']

# Assuming 'website' column exists in the original DataFrame and corresponds to the test set
test_websites = data['website'][X_test.index].reset_index(drop=True)

for i, website in enumerate(test_websites):
    print(f"Website {website} is classified as: {category_labels[predicted_categories[i]]}")
