const Blockchain= require('./Blockchain')
const Vegawallet = new Blockchain();
/*Vegacoin.creatnewblock(644654,'azertqsdfg','azersdfgbgbd');
Vegacoin.creatnewtransaction(20,'sadik','mohamed');*/
/*const previousblockhash='azertghxj';
const correntblockdata=[
  {
    amount:100,
    sender:'sadok',
    recipient:'mohamed'
  },
  {
    amount:50,
    sender:'tarek',
    recipient:'mohamed'
  }
];
//console.log(Vegawallet.proofofwork(previousblockhash,correntblockdata));
console.log(Vegawallet.hashBlock(previousblockhash,correntblockdata,70146));*/

//console.log(Vegawallet);
const bt1={
  "chain": [
  {
  "index": 1,
  "timestamp": 1552754848368,
  "transactions": [],
  "nonce": 100,
  "hash": "0",
  "previousBlockHash": "0"
  },
  {
  "index": 2,
  "timestamp": 1552754965186,
  "transactions": [
  {
  "amount": 300,
  "sender": "hamma",
  "recipient": "sadok",
  "transactionId": "3c8ca080480b11e99b9baf765ea64428"
  },
  {
  "amount": 200,
  "sender": "hamma",
  "recipient": "sadok",
  "transactionId": "40fa81f0480b11e99b9baf765ea64428"
  }
  ],
  "nonce": 144304,
  "hash": "0000b2ce6259e74831680942f323f0ce0cccfb6e1998504337bb5d744b51bb6e",
  "previousBlockHash": "0"
  },
  {
  "index": 3,
  "timestamp": 1552755090622,
  "transactions": [],
  "nonce": 57975,
  "hash": "00006d31aa0120bf5529e7cae654fcef857bb5023fb64d296246bdc9c9d7b5a1",
  "previousBlockHash": "0000b2ce6259e74831680942f323f0ce0cccfb6e1998504337bb5d744b51bb6e"
  },
  {
  "index": 4,
  "timestamp": 1552755151410,
  "transactions": [],
  "nonce": 4846,
  "hash": "0000afaa15f8f4a9201740497d1d8ee04daf99aa76c2c73999552f9adb959690",
  "previousBlockHash": "00006d31aa0120bf5529e7cae654fcef857bb5023fb64d296246bdc9c9d7b5a1"
  }
  ],
  "pendingTransactions": [],
  "currentNodeUrl": "http//:localhost:3001",
  "networkNodes": []
  }
  console.log('valid: ', Vegawallet.chainIsValid(bt1.chain));