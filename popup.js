/**
 * display what is stored in the chrome storage for this extension
 */
chrome.storage.sync.get(null, function (stored) {
    let list = document.getElementById('list');
    for (let key in stored) {
        let li = document.createElement('li');
        li.textContent = key;
        list.appendChild(li);
    }
});