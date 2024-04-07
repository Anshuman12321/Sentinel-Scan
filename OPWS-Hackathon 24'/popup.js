document.addEventListener('DOMContentLoaded', function() {
    checkSignInStatus();

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
        document.getElementById('questionnaireContainer').style.display = 'none';
        document.getElementById('status').style.display = 'block';
    });

    document.getElementById('edit').addEventListener('click', () => {
        document.getElementById('status').style.display = 'none';
        document.getElementById('questionnaireContainer').style.display = 'block';
    });

    document.getElementById('questionnaireForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Assuming email is stored after signIn/signUp, adjust according to your logic
        chrome.storage.local.get(['userEmail'], function(result) {
            if (result.userEmail) {
                saveQuestionnaire(result.userEmail);
            } else {
                console.error('User email not found.');
            }
        });
    });
});

// signIn, signUp, saveQuestionnaire functions remain unchanged

function checkSignInStatus() {
    chrome.storage.local.get(['userEmail'], function(result) {
        if (result.userEmail) {
            console.log('User is signed in with email:', result.userEmail);
            onLoginSuccess();
        } else {
            console.log('User is not signed in.');
            onloginfailure();
        }
    });
}

async function onloginfailure() {
    document.getElementById('signInContainer').style.display = 'block';
    document.getElementById('signUpContainer').style.display = 'none';
    document.getElementById('questionnaireContainer').style.display = 'none';
}

async function onLoginSuccess() {
    document.getElementById('signInContainer').style.display = 'none';
    document.getElementById('signUpContainer').style.display = 'none';
    document.getElementById('questionnaireContainer').style.display = 'block';
}
