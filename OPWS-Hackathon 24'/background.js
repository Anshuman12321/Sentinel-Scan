// chrome.action.onClicked.addListener(() => {
//   // URL you want to open
//   const url = "https://www.example.com";

//   // Open a new tab with the specified URL
//   chrome.tabs.create({ url });
// });

// function classifyCurrentTabUrl() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var activeTab = tabs[0];
//       var activeTabUrl = activeTab.url; // URL of the current tab

//       // Send the URL to your local server for classification
//       fetch('http://localhost:5000/classify-url', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({url: activeTabUrl}),
//       })
//       .then(response => response.json())
//       .then(data => {
//           // Process and display the classification result
//           console.log(data.classification);
//           // Update your extension's popup or UI accordingly
//       })
//       .catch(error => {
//           console.error('Error classifying URL:', error);
//       });
//   });
// }

// chrome.runtime.onInstalled.addListener(function() {
//   console.log("Extension installed");
//   // Initialize something here, e.g., default settings
//   // Placeholder for actual initialization logic
//   // Example: chrome.storage.local.set({key: value}, function() {
//   //    console.log("Settings initialized.");
//   // });

//   // Check the sign-in status upon installation

//   checkSignInStatus();
// });

// chrome.runtime.onStartup.addListener(function() {
//   // Check the sign-in status upon browser startup
//   checkSignInStatus();
// });



chrome.action.onClicked.addListener(() => {
  // URL you want to open
  const url = "https://www.example.com";

  // Open a new tab with the specified URL
  chrome.tabs.create({ url });
});

function classifyCurrentTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var activeTabUrl = activeTab.url; // URL of the current tab

    // Send the URL to your local server for classification
    fetch('http://localhost:5000/classify-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: activeTabUrl }),
    })
      .then(response => response.json())
      .then(data => {
        // Process and display the classification result
        console.log(data.classification);
        // Update your extension's popup or UI accordingly
      })
      .catch(error => {
        console.error('Error classifying URL:', error);
      });
  });
}

function checkSignInStatus() {
  // Assuming you have some mechanism to check the sign-in status, 
  // for example, using chrome.storage to store the sign-in status
  chrome.storage.local.get('signedIn', function (data) {
    if (data.signedIn) {
      // User is signed in
      // Proceed with your extension logic
      classifyCurrentTabUrl(); // Example: Classify the current tab's URL
    } else {
      // User is not signed in
      // You may want to prompt the user to sign in or take some other action
      console.log("User is not signed in.");
    }
  });
}

chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension installed");
  // Initialize something here, e.g., default settings
  // Placeholder for actual initialization logic
  // Example: chrome.storage.local.set({key: value}, function() {
  //    console.log("Settings initialized.");
  // });

  // Check the sign-in status upon installation
  checkSignInStatus();
});

chrome.runtime.onStartup.addListener(function () {
  // Check the sign-in status upon browser startup
  checkSignInStatus();
});

// Call classifyCurrentTabUrl() when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the URL of the tab has changed
  if (changeInfo.url) {
    classifyCurrentTabUrl();
  }
});
