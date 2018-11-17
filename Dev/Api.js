const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const blockchain =require('./blockchain');
const Vegawallet=new blockchain();
const uuid = require('uuid/v1');

const  nodeID =uuid().split('-').join('');

app.use (bodyparser.json()); 
app.use (bodyparser.urlencoded({extanded:false}));


    app.get('/blockchain', function (req, res) {
     res.send(Vegawallet);
});

//creat a new transaction
    app.post('/transaction', function (req, res){
        /*console.log(req.body);
    res.send(`the amount of transactio is ${req.body} Vegawallet`);
    */
 const blockindex =  Vegawallet.creatnewtransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transacton will be added in block ${blockindex}`});

});


    // mine a block
app.get('/mine', function(req,res){
        const lastblock = Vegawallet.getlastblock();
        const previousBlockHash = lastblock['hash'] ;   
        const currentBlockData={
            transaction: Vegawallet.pendingtransaction,
            index: lastblock['index']+1
        };
        const nonce = Vegawallet.proofofwork(previousBlockHash, currentBlockData);
        const blockhash =Vegawallet.hashBlock(previousBlockHash, currentBlockData,nonce); 
        Vegawallet.creatnewtransaction(20,"00",nodeID);
        const newblock = Vegawallet.creatnewblock(nonce, previousBlockHash, blockhash);
        res.json({
            note: "new block mined successfuly",
            block: newblock
        })
});

app.listen(3000, function(){
    console.log('listing on port 3000...');
});