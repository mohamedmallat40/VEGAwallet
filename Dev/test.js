const Blockchain= require('./Blockchain')
/*const Vegacoin = new Blockchain();
Vegacoin.creatnewblock(644654,'azertqsdfg','azersdfgbgbd');
Vegacoin.creatnewtransaction(20,'sadik','mohamed');*/
const previousblockhash='azertghxj';
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
  },
];
const nonce=100;
console.log(Vegacoin.hashblock(previousblockhash,correntblockdata,nonce));
