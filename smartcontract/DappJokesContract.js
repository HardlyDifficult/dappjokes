// Dapp Jokes is a service which ranks jokes by how much in tips the author has recieved
// 100% of contributions go directly to the Author's wallet.

// Built for Nebulas by HardlyDifficult.  youtube.com/HardlyDifficult
// License: https://github.com/hardlydifficult/DappJokes/blob/master/LICENSE
//
// See also https://github.com/hardlydifficult/DappJokes/

var DappJokesContract = function() 
{
  // Data stored by the smart contract
  LocalContractStorage.defineMapProperty(this, "id_to_joke") // {joke_text, author_addr, vote_count, report_count, tips}

  LocalContractStorage.defineProperty(this, "count");
}

DappJokesContract.prototype = 
{
  // init is called once, when the contract is deployed.
  init: function() 
  {
    this.count = 0;
  },

  getJoke: function(id)
  {
    return this.id_to_joke.get(id);
  },

  getJokeCount: function()
  {
    return this.count;
  },

  postJoke: function(joke)
  {
    if(!joke || joke.length < 3)
    {
      throw new Error("You can do better than that, common..");
    }
    if(joke.length > 200) 
    {
      throw new Error("Whoa, we're not here to read a book..");
    }

    var joke_data = {
      joke_text: joke,
      author_addr: Blockchain.transaction.from,
      vote_count: 0,
      report_count: 0,
      tips: 0,
    };

    var id = this.count++;
    this.id_to_joke.put(id, joke_data);

    return id;
  },

  tip: function(id)
  {
    var joke_data = this.id_to_joke.get(id);
    if(!joke_data)
    {
      throw new Error("404 - not funny.");
    }
    if(!joke_data.joke_text)
    {
      throw new Error("That was naughty...");
    }
    if(Blockchain.transaction.from == joke_data.author_addr)
    {
      throw new Error("That was a good one, but maybe vote for somebody else's joke...");
    }

    Blockchain.transfer(joke_data.author_addr, Blockchain.transaction.value);

    joke_data.tips = new BigNumber(joke_data.tips).add(Blockchain.transaction.value);
    joke_data.vote_count++;
    this.id_to_joke.put(id, joke_data);    
  },

  report: function(id)
  {
    var joke_data = this.id_to_joke.get(id);
    if(!joke_data)
    {
      throw new Error("404 - not funny.");
    }
    if(!joke_data.joke_text)
    {
      throw new Error("That was naughty...");
    }

    joke_data.report_count++;
    if(joke_data.report_count > joke_data.vote_count * 3)
    {
      joke_data.joke_text = null;
    }
    this.id_to_joke.put(id, joke_data);        
  }
}

module.exports = DappJokesContract
