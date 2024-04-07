const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

app.use(express.json());

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    const response = await fetch('https://data.mongodb-api.com/app/data-xxxx/endpoint/data/beta/action/insertOne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.MONGODB_DATA_API_KEY,
        },
        body: JSON.stringify({
            dataSource: 'Cluster0',
            database: 'yourDatabase',
            collection: 'users',
            document: { email, password } 
        })
    });

    const data = await response.json();
    res.send(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
