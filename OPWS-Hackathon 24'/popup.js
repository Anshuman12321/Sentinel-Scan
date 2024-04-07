document.addEventListener('DOMContentLoaded', function() {
    initializePopup();

    document.getElementById('showSignUp').addEventListener('click', () => switchToContainer('signUpContainer'));
    document.getElementById('showSignIn').addEventListener('click', () => switchToContainer('signInContainer'));

    document.getElementById('signInForm').addEventListener('submit', function(event) {
        event.preventDefault();
        signIn();
    });

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        signUp();
    });

    document.getElementById('submit').addEventListener('click', () => switchToContainer('status'));
    document.getElementById('edit').addEventListener('click', () => switchToContainer('questionnaireContainer'));

    document.getElementById('questionnaireForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Assuming email is stored after signIn/signUp, adjust according to your logic
        chrome.storage.local.get(['userEmail'], function(result) {
            if (result.userEmail) {
                saveQuestionnaire(result.userEmail);
                switchToContainer('status'); // Assuming you want to switch to the status container after saving
            } else {
                console.error('User email not found.');
            }
        });
    });
});

function switchToContainer(containerId) {
    let containers = ['signInContainer', 'signUpContainer', 'questionnaireContainer', 'status'];
    containers.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(containerId).style.display = 'block';
    chrome.storage.local.set({currentContainer: containerId});
}

function initializePopup() {
    // Restore the container state
    chrome.storage.local.get(['currentContainer'], function(result) {
        if (result.currentContainer) {
            switchToContainer(result.currentContainer);
        } else {
            // default state
            switchToContainer('signInContainer');
        }
    });
    // Additional restoration of state (e.g., form inputs) goes here
}
