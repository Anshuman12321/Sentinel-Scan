import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Dropout
from tensorflow.keras.callbacks import Callback, EarlyStopping
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

class ModelCheckpointImproved(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if epoch % 50 == 0:
            filename = f'model_epoch_{epoch}_acc_{logs["accuracy"]:.2f}.h5'
            self.model.save(filename)
            print(f'\nModel saved: {filename}')

def load_preprocess_data():
    data = pd.read_csv('security_headers_report.csv')
    features = ['CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'HSTS', 'X-XSS-Protection', 'SSL_Config_Errors', 'Server_Version', 'Info_Exposure', 'HTTP_Methods', 'Email_Exposure']
    X = data[features]
    data['SecurityScore'] = data['SecurityScore'].apply(lambda x: min(x, 2))
    y = to_categorical(data['SecurityScore'], num_classes=3)
    return X, y, data['Website']

def build_model(input_shape):
    model = Sequential([
        Input(shape=(input_shape,)),
        Dense(20, activation='relu'),
        Dropout(0.3),
        Dense(12, activation='relu'),
        Dropout(0.3),
        Dense(8, activation='relu'),
        Dense(3, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train_model(X_train_scaled, y_train, X_test_scaled, y_test, model_save_path='final_model.h5'):
    model = build_model(X_train_scaled.shape[1])
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    
    model.fit(X_train_scaled, y_train, epochs=100, validation_split=0.1, callbacks=[ModelCheckpointImproved(), early_stopping])
    
    final_loss, final_accuracy = model.evaluate(X_test_scaled, y_test)
    print(f'\nFinal model accuracy: {final_accuracy * 100:.2f}%')
    
    model.save(model_save_path)
    print(f'Model saved to {model_save_path}')
    
    return model

def display_predictions(model, X_test_scaled, test_websites, true_categories, predicted_categories):
    category_labels = ['Green - Good', 'Yellow - Alert, but not a threat', 'Red - A threat']
    for i, website in enumerate(test_websites):
        print(f"Website {website} is classified as: {category_labels[predicted_categories[i]]}")
    print("\nClassification Report:")
    print(classification_report(true_categories, predicted_categories, target_names=category_labels, zero_division=0))

if __name__ == "__main__":
    X, y, websites = load_preprocess_data()
    X_train, X_test, y_train, y_test, websites_train, websites_test = train_test_split(X, y, websites, test_size=0.2, random_state=42)
    
    scaler = StandardScaler().fit(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    final_model_path = 'final_model.h5'
    model = train_model(X_train_scaled, y_train, X_test_scaled, y_test, final_model_path)
    
    predictions = model.predict(X_test_scaled)
    predicted_categories = np.argmax(predictions, axis=1)
    true_categories = np.argmax(y_test, axis=1)

    cm = confusion_matrix(true_categories, predicted_categories)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.savefig('confusion_matrix.png')

    display_predictions(model, X_test_scaled, websites_test.reset_index(drop=True), true_categories, predicted_categories)
