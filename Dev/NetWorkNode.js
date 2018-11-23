const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const blockchain =require('./blockchain');
const Vegawallet=new blockchain();
const uuid = require('uuid/v1');
const nodeID =uuid().split('-').join('');
const port = process.argv[2];
const rp = require('request-promise');


app.use (bodyparser.json()); 
app.use (bodyparser.urlencoded({extended:false}));

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
        });
    });

//register a node and broadcast itthe network
app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl =req.body.newNodeUrl;
    if (vegawallet.networknode.indexof(newNodeUrl)==-1)Vegawallet.networknode.push(newNodeUrl);
        const regnodespromises=[];
        vegawallet.networknode.array.forEach(networknodeUrl => {
            //register node and point
            const requestoption ={
                uri: networknodeUrl +'/register-node',
                methode: 'post',
                body: { newNodeUrl:newNodeUrl},
                json: true
                
            };
        regnodepromises.push(rq(requestoption));
        }); 
    Promise.all(regnodespromises)
    .then(data => {
        const bulkregesteroptions = {
            uri : newNodeUrl+'/regester-nodes-bulk',
            methode : post,
            body: {allnetworknodes:[...vegawallet.networknode,Vegawallet.currentNodeUrl]},
            json : true
        };
        return rp(bulkregesteroptions);
    })
    .then(data =>{
        res.json({note: 'new node regester with network succefuly'});
    });
});

//register a node with the network
app.post('/regester-node', function(req,res){

});

//register multupile nodes at ones 
app.post('/register-nodes-bulk', function(req,res){


});


app.listen(port, function(){
    console.log(`listing on port ${port}...`);
});
