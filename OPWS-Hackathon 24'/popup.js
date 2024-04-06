
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
    // Implement your signIn logic here
    console.log('Sign-in logic to be implemented');
}

async function signUp() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value; // Reminder: Storing plain-text passwords is unsafe

    // Directly embedding the API URL and API Key in the code (not recommended for production)
    const apiUrl = 'https://us-east-1.aws.data.mongodb-api.com/app/data-xoxyq/endpoint/data/v1';
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
                dataSource: 'PROJECT 0',
                database: 'OWPS',
                collection: 'username',
                document: { email, password } // Example document structure
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Handle successful sign up
        console.log('Signed up:', data);
        // Further actions like user feedback or redirecting
    } catch (error) {
        // Handle sign up error
        console.error('Error during sign-up:', error);
        // User feedback for failure
    }
}
