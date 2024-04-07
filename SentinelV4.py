import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.callbacks import Callback
from tensorflow.keras.utils import to_categorical

class ModelCheckpointImproved(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if epoch % 20 == 0:
            filename = f'model_epoch_{epoch}_acc_{logs["accuracy"]:.2f}.h5'
            self.model.save(filename)
            print(f'\nModel saved: {filename}')

def load_preprocess_data(filepath='security_headers_report.csv'):
    data = pd.read_csv(filepath)
    # Adjust here based on your actual features
    features = ['CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'HSTS', 'X-XSS-Protection', 'SSL_Config_Errors', 'Server_Version', 'Info_Exposure', 'HTTP_Methods', 'Email_Exposure']
    X = data[features]
    # Assuming 'SecurityScore' needs to be mapped to 3 categories
    # The mapping logic should be adjusted based on your dataset's specifics
    data['Category'] = pd.cut(data['SecurityScore'], bins=[-np.inf, 1, 3, np.inf], labels=[0, 1, 2])
    y = to_categorical(data['Category'])
    return X, y, data['Website']

def build_model(input_shape):
    model = Sequential([
        Input(shape=(input_shape,)),
        Dense(20, activation='relu'),
        Dense(12, activation='relu'),
        Dense(8, activation='relu'),
        Dense(3, activation='softmax')  # For 3 classes
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train_model(X_train_scaled, y_train, X_test_scaled, y_test):
    model = build_model(X_train_scaled.shape[1])
    model.fit(X_train_scaled, y_train, epochs=60, validation_data=(X_test_scaled, y_test), callbacks=[ModelCheckpointImproved()])
    
#
    final_loss, final_accuracy = model.evaluate(X_test_scaled, y_test)
    print(f'\nFinal model accuracy: {final_accuracy * 100:.2f}%')
#

    return model

def display_predictions(model, X_test_scaled, test_websites):
    predictions = model.predict(X_test_scaled)
    predicted_categories = np.argmax(predictions, axis=1)
    category_labels = ['Green - Good', 'Yellow - Alert, but not a threat', 'Red - A threat']
    for i, website in enumerate(test_websites):
        print(f"Website {website} is classified as: {category_labels[predicted_categories[i]]}")

if __name__ == "__main__":
    X, y, websites = load_preprocess_data()
    X_train, X_test, y_train, y_test, websites_train, websites_test = train_test_split(X, y, websites, test_size=0.2, random_state=42)
    scaler = StandardScaler().fit(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = train_model(X_train_scaled, y_train, X_test_scaled, y_test)
    display_predictions(model, X_test_scaled, websites_test.reset_index(drop=True))
