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
    if (vegawallet.networknode.indexOf(newNodeUrl)== -1)Vegawallet.networknode.push(newNodeUrl);

        const regnodespromises=[];
        vegawallet.networknode.array.forEach(networknodeUrl => {
            //register node and point
            const requestOption ={
                uri: networknodeUrl +'/register-node',
                methode: 'post',
                body: { newNodeUrl: newNodeUrl},
                json: true
                
            };

            regnodepromises.push(rq(requestOption));

        }); 

    Promise.all(regnodespromises)
        .then(data => {
            const bulkRegisterOption = {
                uri : newNodeUrl+'/regester-nodes-bulk',
                methode : post,
                body: {allnetworknodes:[...vegawallet.networknodes,Vegawallet.currentNodeUrl]},
                json : true
        };
        return rp(bulkRegisterOption);
    })
    .then(data =>{
        res.json({note: 'new node regester with network succefuly'});
    });
});




//register a node with the network
app.post('/register-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const nodenotalreadypreast = Vegawallet.networknodes.indexOf(newNodeUrl) == -1;
    const notecurrentnode = Vegawallet.currentNodeUrl !== newNodeUrl;
    if  (nodenotalreadypreast && notecurrentnode)Vegawallet.networknodes.push(newNodeUrl);
    res.json({  note : 'new node regestered successfully.  '}); // bech n7outo node jdida fi arrey mta3 nodes
                                                                 // if bech ntastiw beha ken node déja fil arrey
    });



//register multupile nodes at ones 
app.post('/register-nodes-bulk', function(req,res){
    const allnetworknodes = req.body.allnetworknodes;
    allnetworknodes.forEach(networknodeUrl=> {
const nodenotalreadypreast =  Vegawallet.networknodes.indexOf(networknodeUrl) == -1 ;
const notcurrentnode = Vegawallet.currentNodeUrl !== networknodeUrl;       
if (nodenotalreadypreast && notcurrentnode) Vegawallet.networknodes.push(networknodeUrl);

    })
    res.json({ note: 'bulk registration successfuly.'});

});




app.listen(port, function(){
    console.log(`listing on port ${port}...`);
});
