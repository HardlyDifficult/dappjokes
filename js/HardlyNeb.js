let NebPay = require("nebpay");
let nebPay = new NebPay();

function nebWrite(method, args, listener) 
{
    nebPay.call(contract_address, 0, method, JSON.stringify(args), 
    {
        listener: function(resp)
        {
            if(listener)
            {
                listener(resp);
            }
        }
    });
}

function nebRead(method, args, listener) 
{
    nebPay.simulateCall(contract_address, 0, method, JSON.stringify(args), {
        listener: function(resp) 
        {
            var error = resp.execute_err;
            var result;
            if(!error) 
            {
                if(resp.result) 
                {
                    result = JSON.parse(resp.result);
                }
            } else 
            {
                console.log("Error: " + error);
            }
        
            listener(result, error, args);
        }
    });
}

// The nebulas API, used for signing transactions, etc
var nebulas = require("nebulas");
var neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(nebulas_domain));

function nebReadAnon(method, args, listener) 
{
     neb.api.call({
         from: contract_address, // Using the contract here so this can be called without loggin on.
         to: contract_address,
         value: 0,
         nonce: 0, // Nonce is irrelavant when read-only (there is no transaction charge)
         gasPrice: gas_price,
         gasLimit: gas_limit,
         contract: {function: method, args: JSON.stringify(args)} 
     }).then(function (resp) 
     {
        var error = resp.execute_err;
        var result;
        if(resp.result) 
        {
            result = JSON.parse(resp.result);
        } 
        else 
        {
            console.log("Error: " + error);
        }
    
        listener(result, error, args);      
     });        
 }