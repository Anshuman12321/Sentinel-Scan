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
                dataSource: 'project0',
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

document.getElementById('signUpBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form from submitting
    console.log('Sign-up button clicked');
    // signUp(); // Temporarily commented out
});

document.addEventListener('DOMContentLoaded', () => {
    // Other initialization code...

    // Use 'submit' event for the form for better semantics and accessibility
    document.getElementById('signUpForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        signUp(); // Call your signUp function
    });
});

// Ensure this function is correctly defined
function signUp() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    // Your fetch request or other sign-up logic here...
    console.log('Attempting to sign up with:', email, password);
}