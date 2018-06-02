var jokes = [];

// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x) => {
    var parts = Number.parseFloat(x).toFixed(8).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

function formatCoins(number) 
{
    var x = number / token_divider;
    return numberWithCommas(x) + " $nas";
}

function submitJoke()
{
    var joke = $("#newjoke").val();
    nebWrite("postJoke", [joke], function(resp) 
    {
        showThanks(resp.txhash);        
    });
}

function report(id)
{
    nebWrite("report", [id]);
}

nebReadAnon("getJokeCount", null, function(count)
{
    for(var i = 0; i < count; i++)
    {
        getJoke(i, function(joke_data)
        {
            jokes.push(joke_data);
            jokes.sort(function (a, b) 
            {
                return parseInt(a.tips) < parseInt(b.tips);
            });

            $("#joke_list").text("");
            for(var i2 = 0; i2 < jokes.length; i2++)
            {
                var joke = jokes[i2];
                var tmp = document.createElement("DIV");
                tmp.innerHTML = joke.joke_text;
                $("#joke_list").append("<div class='card text-center'><div class='row'><div class='col'>"
                    + (tmp.textContent || tmp.innerText || "")
                    + "</div></div><hr><div class='row options'><div class='col'>"
                    + formatCoins(joke.tips) 
                    + " </div><div class='col'><a href='Tip.html#"
                    + joke.id
                    + "'>Tip</a></div><div class='col'><a href='#' onclick='report("
                    + joke.id
                    + ")'>Report</a></div></div></div>");
            }
        });
    }
});

function showThanks(txhash)
{
    window.location.hash = txhash;
    $("#thanks-message").show();
    $("#explorer").click(function(){window.location="https://explorer.nebulas.io/#/tx/" + txhash});
    
    function autoRefresh() 
    {
        nebGetTxStatus(txhash, function(resp) 
        {
            console.log(resp);
            if(resp.status == 1) 
            {
                redirectToHome();
            } else if(resp.execute_error)  
            {
                $("#error-resp").text(resp.execute_error);
            } else {
                setTimeout(autoRefresh, 3000);
            }
            return;
        },
        function(error)
        {
            console.log(error); 
            $("#error-resp").text(error);
            setTimeout(autoRefresh, 3000);            
        });
    }

    autoRefresh();
}

var txhash = window.location.hash.substr(1);
if(txhash)
{
    showThanks(txhash);
}