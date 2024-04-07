document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showSignUp').addEventListener('click', () => {
        document.getElementById('signInContainer').style.display = 'none';
        document.getElementById('signUpContainer').style.display = 'block';
    });

    document.getElementById('showSignIn').addEventListener('click', () => {
        document.getElementById('signUpContainer').style.display = 'none';
        document.getElementById('signInContainer').style.display = 'block';
    });

    document.getElementById('signInForm').addEventListener('submit', function(event) {
        event.preventDefault();
        signIn();
    });

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        signUp();
    });
});

async function signIn() {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const apiUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/data-xoxyq/endpoint/data/v1/action/findOne';
    const apiKey = '661114d286feecedd0ad7749';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource: 'OWPS',
                database: 'OWPS',
                collection: 'username', // The collection where users are stored
                filter: {"email": email} // Finding document by email
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // VERY IMPORTANT: Never verify passwords client-side in production apps
        // This example is purely for educational purposes
        if (data.document && data.document.password === password) {
            console.log('Sign-in successful:', data);
            alert('Sign-in successful.');
        } else {
            console.error('Sign-in failed: Incorrect email or password.');
            alert('Incorrect email or password. Please try again.');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        alert('Error during sign-in. Please try again.');
    }
}

async function signUp() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    const apiUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/data-xoxyq/endpoint/data/v1/action/insertOne';
    const apiKey = '661114d286feecedd0ad7749'; // Reminder: Storing API keys in plaintext is unsafe

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource: 'OWPS',
                database: 'OWPS',
                collection: 'username', // Ensure this is the correct collection name
                document: {"email": email,"password": password } // Storing passwords in plaintext is unsafe
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Handle successful sign up
        console.log('Signed up:', data);
        alert('Sign-up successful.'); // Providing feedback to the user
    } catch (error) {
        // Handle sign up error
        console.error('Error during sign-up:', error);
        alert('Error during sign-up. Please try again.'); // Providing feedback to the user
    }
}