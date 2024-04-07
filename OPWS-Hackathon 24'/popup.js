document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already signed in
    document.addEventListener('DOMContentLoaded', function() {
        checkSignInStatus();
    });
    
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
    document.getElementById('submit').addEventListener('click', () => {
        document.getElementById('questionnaire').style.display = 'none';
        document.getElementById('status').style.display = 'block';
    });
    document.getElementById('edit').addEventListener('click', () => {
        document.getElementById('status').style.display = 'none';
        document.getElementById('questionnaire').style.display = 'block';
        
    });
    
    
    //Submit button to save profile data
    document.getElementById('questionnaire').addEventListener('submit', function(event) {
        event.preventDefault();
        saveQuestionnaire(email);
        console.log('Form submitted')
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
            let userEmail = email; // This would be the email the user signed in with
            chrome.storage.local.set({userEmail: userEmail}, function() {
                console.log("User is signed in with email:", userEmail);
                // Further actions after successful sign-in
            })
            onLoginSuccess();
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

async function profilefind() {
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
                collection: 'profile', // The collection where users are stored
                filter: {"email": email} // Finding document by email
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // VERY IMPORTANT: Never verify passwords client-side in production apps
        // This example is purely for educational purposes
        if (data.document && data.document.email === email) {
            console.log('Sign-in successful:', data);
            SignedIn();
        } else {
            console.error('Sign-in failed: Incorrect email or password.');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        alert('Error during sign-in. Please try again.');
    }
}

async function onloginfailure() {
    document.getElementById('signInContainer').style.display = 'block';
    document.getElementById('signUpContainer').style.display = 'none';
    document.getElementById('questionnaire').style.display = 'none';
}

async function onLoginSuccess() {
    document.getElementById('signInContainer').style.display = 'none';
    document.getElementById('signUpContainer').style.display = 'none';
    document.getElementById('questionnaire').style.display = 'block';
}

function checkSignInStatus() {
    chrome.storage.local.get("userEmail", function(result) {
        if (result.userEmail) {
            console.log("User is signed in with email:", result.userEmail);
            onLoginSuccess();
            // You can adjust the UI or perform actions as needed
        } else {
            console.log("User is not signed in.");
            onloginfailure();
            // Show sign-in page or prompt user to sign in
        }
    });
}

async function saveQuestionnaire(email) {

    // Extract data from form elements, e.g.,
    const studytype = document.getElementById('studytype').value;
    const studyLevel = document.getElementById('studylevel').value;
    const major = document.getElementById('major').value;
    const contenttype = document.getElementById('content').value;

    /*chrome.storage.local.set({questionnaireData: questionnaireData}, function() {
        console.log('Questionnaire data saved.');
        // Additional logic for after saving questionnaire data
    });*/
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
                collection: 'profile', // Ensure this is the correct collection name
                document: {"studytype": studytype, "studyLevel": studyLevel,"major": major,"contentType": contenttype, "email": email} // Storing passwords in plaintext is unsafe
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Handle successful sign up
        console.log('Done:', data);
        alert('Successful.'); // Providing feedback to the user
    } catch (error) {
        // Handle sign up error
        console.error('Error during questiannaire:', error);
        alert('Error during questiannaire, Please try again.'); // Providing feedback to the user
    }
}