import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Dropout
from tensorflow.keras.callbacks import Callback
from tensorflow.keras.utils import to_categorical

class ModelCheckpointImproved(Callback):
    def on_epoch_end(self, epoch, logs=None):
        if epoch % 20 == 0:
            filename = f'model_epoch_{epoch}_acc_{logs["accuracy"]:.2f}.h5'
            self.model.save(filename)
            print(f'\nModel saved: {filename}')

def load_preprocess_data():
    data = pd.read_csv('security_headers_report.csv')
    features = ['CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'HSTS', 'X-XSS-Protection', 'SSL_Config_Errors', 'Server_Version', 'Info_Exposure', 'HTTP_Methods', 'Email_Exposure']
    X = data[features]
    
    # Ensure SecurityScore only contains values 0, 1, or 2 before applying to_categorical
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
        Dense(3, activation='softmax')  # Adjusted for 3 classes
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

if __name__ == "__main__":
    X, y, websites = load_preprocess_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler().fit(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = build_model(X_train_scaled.shape[1])
    model.fit(X_train_scaled, y_train, epochs=100, validation_split=0.1, callbacks=[ModelCheckpointImproved()])
    final_loss, final_accuracy = model.evaluate(X_test_scaled, y_test)
    print(f'\nFinal model accuracy: {final_accuracy * 100:.2f}%')
