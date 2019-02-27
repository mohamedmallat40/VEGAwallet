const sha256= require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');


 function Blockchain() {
    this.chain = [];
    this.pendingtransaction= [];
    this.currentNodeUrl=currentNodeUrl;
    this.netWorkNodes = []; 
    this.creatNewBlock(100,'0','0'); //every blockchain starter with first block ( genisis block)

}

  Blockchain.prototype.creatNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock ={
      index:  this.chain.length +1, // creat a new block
      timestamp: Date.now(), // creation date of the block
      transactions: this.pendingtransaction, //put all of the new trransction or all of the pending transactions on the block // ma3neha l new transactions lkol bech yet7atou fil block jdid li 9a3din nasn3ou fih
      nonce: nonce, //
      hash: hash, // hashing mta3 li block hedha
      previousBlockHash: previousBlockHash, // hashing mta3 leblock li ba3dou
    };
      this.pendingtransaction = []; //
      this.chain.push(newBlock); // l7al9a lola fi chain ta5o l block hedha

    return newBlock;
   };

  Blockchain.prototype.getlastblock= function(){
    return this.chain[this.chain.length -1]; // fonction trajja3 ekher block
   };

  Blockchain.prototype.creatNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
      amount: amount, //9adeh chyab3eth
      sender: sender, // address mta3 ly chyab3eth
      recipient: recipient, // add mta3 li chye9bel
      transactionID: uuid().split('_').join('') 
    };

    return newTransaction;

    };
     Blockchain.prototype.AddTransactionToPendingTransactions = function(transactionObj){
        this.pendingtransaction.push(transactionObj);
        return this.getlastblock()['index'] +1;

    };




   Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	    const hash = sha256(dataAsString);
      return hash;
   };
    Blockchain.prototype.proofofwork= function(previousBlockHash,currentBlockData){
      let nonce=0;
      let hash= this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while(hash.substring(0,4)!== '0000'){
          nonce++;
          hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
          //console.log(hash);
        };
      return nonce;
    };
   

module.exports = Blockchain;
