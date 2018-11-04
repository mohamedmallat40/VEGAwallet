const sha256= require('sha256');


function Blockchain() {
    this.chain = [];
    this.pendingtransaction= [];

}

  Blockchain.prototype.creatnewblock = function(nonce, previousblockhash, hash){
    const newblock ={
      index:  this.chain.length +1, // creat a new block
      timestamp: Date.now(), // creation date of the block
      transactions: this.pendingtransaction, //put all of the new trransction or all of the pending transactions on the block // ma3neha l new transactions lkol bech yet7atou fil block jdid li 9a3din nasn3ou fih
      nonce: nonce, //
      hash: hash, // hashing mta3 li block hedha
      previousblockhash: previousblockhash, // hashing mta3 leblock li ba3dou
    };
      this.pendingtransaction = []; //
        this.chain.push(newblock); // l7al9a lola fi chain ta5o l block hedha

    return newblock;
   }

  Blockchain.prototype.getlastblock= function(){
    return this.chain[this.chain.length -1]; // fonction trajja3 ekher block
   }

  Blockchain.prototype.creatnewtransaction = function(amount, sender, recipient){
    const newtransaction = {
      amount:amount, //9adeh chyab3eth
        sender:sender, // address mta3 ly chyab3eth
          recipient:recipient // add mta3 li chte9bel
    };

    this.pendingtransaction.push(newtransaction); // pending transactions mazelou mahoumchy validated yet
      return this.getlastblock()['index'] + 1;
   }

   Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	     const hash = sha256(dataAsString);
	      return hash;
   };

module.exports = Blockchain;
