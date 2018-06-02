var joke_id = window.location.hash.substring(1);
if(!joke_id) 
{
    redirectToHome();
}

getJoke(joke_id, function(joke_data)
{
    if(!joke_data)
    {
        redirectToHome();
    }
    
    $("#joke").text(joke_data.joke_text);
    $("#author").text(joke_data.author_addr)
});

function tip()
{
    if($("#tip-amount").val() < .0001)
    {
        $("#error-resp").text("Please tip at least 0.0001 $nas");
        $("#alert").show();
        return;
    }

    nebWrite("tip", [joke_id], function(resp, error)
    {
        if(!resp.txhash)
        { // Error
            $("#error-resp").text(resp);
            $("#error-text").text(error);
            $("#alert").show();
            return;
        }

        redirectToHome("#" + resp.txhash);    
    }, $("#tip-amount").val());
}
