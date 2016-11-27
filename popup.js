/**
 * display what is stored in the chrome storage for this extension
 */
function load() {
    let list = document.getElementById('list');
    list.innerHTML = '';

    chrome.storage.sync.get(null, function (stored) {

        for (let key in stored) {
            let li = document.createElement('li');
            li.textContent = key;
            list.appendChild(li);
        }
    });
}

/**
 * clear the storage
 */
document.getElementById('clear').addEventListener('click', function () {
    if(window.confirm('Do you really want to clear all submitted sites? This will resubmit them on the next visit.')) {
        chrome.storage.sync.clear();
        load();
    }
});

// initial load
load();