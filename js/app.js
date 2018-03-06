(function() {

    function flash() {
        const s = document.getElementById('balance');
        var op = 0.1;
        var increment = +0.1;
        s.style.opacity = 0;

        var timer = setInterval(function() {
            op += increment;
            s.style.opacity = op;
            if (op >= 1) increment = -increment;
            if (op <= 0) {
                s.style.opacity = 1;
                clearInterval(timer); // end
            }
        }, 50);

    }

    function balanceCallback(balance) {
        var options = {'balance' : balance};
        chrome.storage.sync.set(options, function() {});
        document.getElementById('balance').innerText = balance;
        flash()
    }

    chrome.storage.sync.get(['account', 'balance'], function(item) {
        if (item.hasOwnProperty('balance')){
            document.getElementById('balance').innerText = item['balance'];
        }

        if(item.hasOwnProperty('account')) {
            if(!item['account']){
                document.getElementById('account').innerText = 'Not Set ...'
            }else{
                window.account = item['account'];
                document.getElementById('account').innerText = item['account'];
                //get balance with delay
                setTimeout(function func() {
                    getBalance(item['account'], balanceCallback)
                }, 1000);
            }
        }

    });

    document.getElementById("refreshBtn").onclick = function() {
        if(window.account){
            getBalance(window.account, balanceCallback)
        }
    };


}());
