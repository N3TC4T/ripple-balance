(function() {

    // init inputs from storage
    chrome.storage.sync.get(['account', 'connect'], function(item) {
        if(item.hasOwnProperty('account')) {
            document.getElementById('account').value = item['account'];
            document.getElementById('connect').checked = item['connect'];
        }
    });


    document.getElementById("saveBtn").onclick = function() {
        var account = document.getElementById('account').value;
        var connect = document.getElementById('connect').checked;


        // check for valid ripple address before save
        var pattern = new RegExp('(?:^r[0-9a-zA-Z]{33}$)');
        var valid = pattern.test(account);
        if(!valid)
            return alert('Invalid Address!');

        chrome.storage.sync.get(['account'], function(item) {
            var options = {
                'account' : account,
                'connect' : connect
            };

            // check if account changed then set balance to zero
            if(item.hasOwnProperty('account')) {
                 if (item['account'] !== account){
                     Object.assign(options, {'balance': 0});
                 }

            }

            chrome.storage.sync.set(options, function() {
                //send signal that we need to restart the extension
                chrome.runtime.sendMessage("naanmfnncpcmciebfkgihhhlfmjdpdja",{type: 'restart' });
                alert('Settings saved!');
            });
        });


    };


}());
