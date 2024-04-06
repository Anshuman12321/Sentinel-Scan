const express = require('express');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const router = express.Router();

// Environment variables for MongoDB connection
const mongoDBApiUrl = process.env.MONGODB_API_URL; // Your MongoDB API base URL
const apiKey = process.env.MONGODB_API_KEY; // Your MongoDB API key

// Hashing strength parameter
const saltRounds = 10;

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ success: false, message: 'Error hashing password' });
        }

        // Now, `hash` is the hashed password
        try {
            const response = await fetch(`${mongoDBApiUrl}/path/to/your/collection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': apiKey,
                },
                body: JSON.stringify({
                    email,
                    password: hash // Store the hashed password
                })
            });

            if (!response.ok) {
                throw new Error(`Error from MongoDB Service: ${response.statusText}`);
            }

            const data = await response.json();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Database API call failed:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

module.exports = router;