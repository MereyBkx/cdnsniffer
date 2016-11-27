// the list of recognized CDNs
let re = new RegExp(
    '^(https?:)?//(' +
    'cdn\\.jsdelivr\\.net' + '|' +
    'cdnjs\\.cloudflare\\.com/' + '|' +
    'ajax\\.googleapis\\.com/ajax/libs/' + '|' +
    'ajax\\.aspnetcdn\\.com/ajax/' + '|' +
    'code\\.jquery\\.com/' +
    ')',
    'i'
);

// check the source for any CDN script sources
document.querySelectorAll('script[src]').forEach(function (element) {
    let result = element.src.match(re);
    if (!result) return;
    console.log('CDN found: ' + result[2] + ' ' + element.src + ' ' + document.location.host);
    report(document.location.host, result[2], element.src);
});

/**
 * Report the CDN if it hasn't been reported, yet
 *
 * This posts asynchronously to a Googe Doc spreadsheet. Domain + URL are recorded in
 * chrome local storage, so no duplicates are sent (per user)
 *
 * @param {string} domain
 * @param {string} cdn
 * @param {string} cdnurl
 */
function report(domain, cdn, cdnurl) {
    let key = domain + ' ' + cdnurl;

    chrome.storage.sync.get(null, function (stored) {
        if (stored[key]) {
            console.log('CDN already reported');
            return;
        }

        let data = 'entry.294744190=' + encodeURIComponent(domain) + '&' +
                'entry.1631167634=' + encodeURIComponent(cdn) + '&' +
                'entry.933459085=' + encodeURIComponent(cdnurl)
            ;

        let http = new XMLHttpRequest();
        http.open(
            'POST',
            'https://docs.google.com/forms/d/e/1FAIpQLSdTaHQqDrMN-yc7xWFoCYMop0Ep3mkEuRCunAAEquy6ZVYtuw/formResponse',
            true
        );
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function () {
            if (http.readyState !== XMLHttpRequest.DONE) return;
            if (http.responseText.match(/Your response has been recorded/)) {
                console.log('CDN reported');
                let store = {};
                store[key] = true;
                chrome.storage.sync.set(store);
            }
        };
        http.send(data);
    });
}


