var socket;
var account;

function closeSocket() {
    // close exist socket
    if (socket !== undefined) {
        socket.close();
    }
}
function openSocket() {

    // close exist socket
    if (socket !== undefined) {
        socket.close();
    }

    socket = new WebSocket('wss://s1.ripple.com:443');

    socket.onopen = function() {

        chrome.storage.sync.get(['account'], function(item) {
            if(item.hasOwnProperty('account')) {
                if(item['account']) {
                    window.account = item['account'];
                }
            }

            data = {
                "id": "subscribe",
                "command": "subscribe",
                "accounts": [window.account]
            };

            socket.send(JSON.stringify(data));

            chrome.browserAction.setIcon({
                path : {
                    "16": "icons/icon16.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                }
            });

            chrome.browserAction.setBadgeText({ "text": "" });

        });

    };

    socket.onmessage = function(message) {
        try{
            var jsonData = JSON.parse(message.data);

            if(jsonData.type === 'transaction') {
                // show only receive payments
                /** @namespace jsonData.transaction.Destination */
                var transaction = jsonData.transaction;
                if (transaction.Destination === window.account){
                    /** @namespace transaction.Account */
                    /** @namespace transaction.Amount */
                    var options = {
                        type: "basic",
                        title: "Incoming Transactions!",
                        message: 'Received ' + transaction.Amount / 1000000 + ' XRP from ' + transaction.Account,
                        iconUrl: "/icons/receive.png",
                        isClickable: true
                    };

                    chrome.notifications.create("", options, function(notificationId) {
                        setTimeout(function(){
                            chrome.notifications.clear(notificationId, function(){});
                        }, 7000);
                    });
                    chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
                        chrome.notifications.clear(notificationId, function(){});
                        chrome.tabs.create({url: 'https://xrpcharts.ripple.com/#/transactions/' + transaction.hash});
                    });

                }

            }

        }catch (e){
            console.log(e)
        }
    };

    socket.onclose = function(e) {
        chrome.browserAction.setIcon({
            path : {
                "16": "icons/icon16-grey.png",
                "48": "icons/icon48-grey.png",
                "128": "icons/icon128-grey.png"
            }
        });
    };
}


function boot() {
    chrome.storage.sync.get(['account', 'connect'], function(item) {
        // set values in first run if not set
        if(!item.hasOwnProperty('account') || !item.hasOwnProperty('connect')){
            var options = {'account' : null, 'connect' : true};
            chrome.storage.sync.set(options, function() {});
        }else{
            if (item['account']) {
                window.account = item.account;

                if (item['connect']){
                    window.connect = item.connect ;
                    openSocket();
                }else{
                    closeSocket();
                }
            }
        }

    });
}

(function() {

    // initialize in first run
    boot();


    // if extension need to restart
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.hasOwnProperty('type') && request.type === 'restart'){
                boot()
            }
    });


})();
