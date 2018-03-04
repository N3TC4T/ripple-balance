(function() {

    function flash() {
        var s = document.getElementById('balance');
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

    function getBalance(account) {
        const base_url = "https://data.ripple.com/v2/accounts/";

        var xhr = new XMLHttpRequest();
        try {
            xhr.open("GET", base_url + account + '/balances?currency=XRP', false);
            xhr.send();

            var resp = JSON.parse(xhr.responseText);

            if(resp.result === "success"){
                var balance = resp.balances[0].value ;
                document.getElementById('balance').innerText = balance
                flash()
            }
        }
        catch (e) {
            alert("Error: " + e.toString())
        }



    }

    chrome.storage.sync.get(['address'], function(item) {
        if(item.hasOwnProperty('address')) {
        if(!item['address']){
            document.getElementById('address').innerText = 'Not Set ...'
        }else{
                window.address = item['address']
                document.getElementById('address').innerText = item['address'];
                getBalance(item['address'])
            }
        }

    });

    document.getElementById("refreshBtn").onclick = function() {
        if(window.address){
            getBalance(window.address)
        }
    };


}());
