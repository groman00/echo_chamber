function find(_tab) {
    chrome.storage.sync.get('targetPerson', function(value) {

        chrome.tabs.executeScript(_tab.id, { file: "/scripts/find.js" }, function(values) {
            console.log('executed find.js');
            console.log(values);
            replace(values);
        });
    })
}


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    find(tab);
});
