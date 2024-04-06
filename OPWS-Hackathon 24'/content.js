let message = {greeting: "hello"};
chrome.runtime.sendMessage(message, function(response) {
  console.log(response.farewell);
}); 
