var jokes = [];

function formatCoins(number) 
{
    if(number > 1000000000000000)
    {
        var factor = Math.pow(10, 3);
        var x = Math.round((number / token_divider) * factor) / factor;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " $nas";
    } 
    else if(number > 0)
    {
        return "< .001 $nas";
    }
    else
    {
        return "0";
    }
}

function submitJoke()
{
    var joke = $("#newjoke").val();
    nebWrite("postJoke", [joke]);
}

function tip(id)
{
    nebWrite("tip", [id]);
}

function report(id)
{
    nebWrite("report", [id]);
}

nebReadAnon("getJokeCount", null, function(count)
{
    for(var i = 0; i < count; i++)
    {
        nebReadAnon("getJoke", [i], function(joke_data, error, args)
        {
            if(joke_data && joke_data.joke_text)
            {
                jokes.push(joke_data);
                jokes.sort(function (a, b) 
                {
                    return a.tips < b.tips;
                });
                $("#joke_list").text("");
                for(var i = 0; i < jokes.length; i++)
                {
                    var joke = jokes[i];
                    $("#joke_list").append("<div class='card text-center'><div class='row'><div class='col'>"
                        + joke.joke_text
                        + "</div></div><hr><div class='row options'><div class='col'>"
                        + formatCoins(joke.tips) 
                        + " </div><div class='col'><a href='#' onclick='tip("
                        + args[0]
                        + ")'>Tip</a></div><div class='col'><a href='#' onclick='report("
                        + args[0]
                        + ")'>Report</a></div></div></div>");
                }
            }        
        });
    }
});