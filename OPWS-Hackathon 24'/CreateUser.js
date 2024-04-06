const mongoose = require('mongoose');
const User = require('./UserModel'); // Adjust path as necessary

mongoose.connect('mongodb+srv://Sibaie:Wolfowski12345@owps.od6jflh.mongodb.net/?retryWrites=true&w=majority&appName=OWPS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Function to create a new user
const createUser = async (username, password) => {
  const user = new User({ username, password });
  
  try {
    await user.save();
    console.log('User saved:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}; 