function getBalance(account, callback) {
    const base_url = "https://data.ripple.com/v2/accounts/";

    var xhr = new XMLHttpRequest();
    try {
        xhr.open("GET", base_url + account + '/balances?currency=XRP', false);
        xhr.send();

        var resp = JSON.parse(xhr.responseText);

        if(resp.result === "success"){
            if (typeof callback === "function") {
                callback(resp.balances[0].value)
            }
        }
    }
    catch (e) {
        alert("Error: " + e.toString())
    }
};