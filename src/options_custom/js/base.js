(function() {

    chrome.storage.sync.get(['address'], function(item) {
        if(item.hasOwnProperty('address')) {
            document.getElementById('address').value = item['address'];
        }
    });


    document.getElementById("saveBtn").onclick = function() {
        var options = {
            'address' : document.getElementById('address').value
        };
        chrome.storage.sync.set(options, function() {
            console.log('Settings saved');
        });
    };


}());
