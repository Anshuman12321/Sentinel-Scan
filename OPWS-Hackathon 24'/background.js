chrome.action.onClicked.addListener(() => {
    // URL you want to open
    const url = "https://www.example.com";

    // Open a new tab with the specified URL
    chrome.tabs.create({ url });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "hello") {
        sendResponse({farewell: "goodbye"});
      }
    }
  ); 
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, {code: '/* your code here */'});
});