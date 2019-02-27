const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const blockchain =require('./blockchain');
const Vegawallet=new blockchain();
const uuid = require('uuid/v1');
const nodeID =uuid().split('-').join('');
const port = process.argv[2];
const rp = require('request');
//var rp = require('http').request;

app.use (bodyparser.json()); //
app.use (bodyparser.urlencoded({extended:false})); 

   


app.get('/blockchain', function (req, res) {
     res.send(Vegawallet);
});



//creat a new transaction
    app.post('/transaction', function (req, res){
    const newtransaction= req.body;
    const blockIndex = Vegawallet.AddTransactionToPendingTransactions(newtransaction);
        res.json({note: `transaction will be add  in block ${blockIndex}.`});
}); 



    app.post('/transaction/broadcast', function(req,res){
        const newTransaction = Vegawallet.creatNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
        Vegawallet.AddTransactionToPendingTransactions(newTransaction);

        const requestPromises= [];
        Vegawallet.netWorkNodes.forEach(netWorkNodeUrl => {
            const requestOptions={
                uri: netWorkNodeUrl +'/transaction',
                method: 'POST',
                body: newTransaction,
                json: true
            };
            requestPromises.push(rp(requestOptions));
        });
        Promise.all(requestPromises)
        .then(data =>{
            res.json({note:' transaction created and broadcast seccessfilly.'});
        });
    });





    // mine a block
    app.get('/mine', function(req,res){
        const lastBlock = Vegawallet.getlastblock();
        const previousBlockHash = lastBlock['hash'] ;   
        const currentBlockData={
            transaction: Vegawallet.pendingtransaction,
            index: lastBlock['index']+1
        };
        const nonce = Vegawallet.proofofwork(previousBlockHash, currentBlockData);
        const blockhash =Vegawallet.hashBlock(previousBlockHash, currentBlockData,nonce); 
        //Vegawallet.creatnewtransaction(20,"00",nodeID);
        const newBlock = Vegawallet.creatNewBlock(nonce, previousBlockHash, blockhash);
        const requestPromises = [];
        Vegawallet.netWorkNodes.forEach(netWorkNodeUrl =>{
            const requestOptions = {
             
                uri: netWorkNodeUrl + '/recive-new-block',
                method:'POST',
                body:{newBlock: newBlock},
                json: true
            };
            requestPromises.push(rp(requestOptions)); //win na3mlo request traj3inna promise
        });
        Promise.all(requestPromises)
            .then(data =>{
                const requestOptions ={
                uri: Vegawallet.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body:{
                    amount: 20,
                    sender:"00",
                    recipient:nodeAdress

                    },
                json: true
                };
            return rp(requestOptions);
            })
            .then(data=>{       
                res.json({
                    note: "new block mined successfuly",
                    block: newBlock
            
                });
            });
    });





    //register a node and broadcast ti the network
    
    app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;

       if(Vegawallet.netWorkNodes.indexOf(newNodeUrl) == -1) Vegawallet.netWorkNodes.push(newNodeUrl); // n7otto new nodes fil networknodes arrey
      Vegawallet.netWorkNodes.forEach(newNodeUrl =>{
           regNodesPromises=[]; 
            const requestOptions = {

                uri:        newNodeUrl+'/register-node',
                method:     'POST',
                body:       {newNodeUrl: newNodeUrl},
                json:       true

            };

             regNodesPromises.push(rp(requestOptions));
        });
        Promise.all(regNodesPromises)
        .then (data => {
            
            const bulkRegisterOption = {

                uri:        newNodeUrl + '/register-nodes-bulk',
                method :    'POST',
                body:       {  allNetWorkNodes: [   ...Vegawallet.netWorkNodes, Vegawallet.currentNodeUrl] },
                json:       true
            
            };
                return rp(bulkRegisterOption);
        
        })
        .then(data => {
            res.json({ note: 'New node registred with our network seccessfilly.'});
        });
    });






    //recive and register a node with the network

    app.post('/register-node', function(req, res) {
        const newNodeUrl = req.body.newNodeUrl;
        const nodeNotAlreadyPresent = Vegawallet.netWorkNodes.indexOf(newNodeUrl) == -1;
        const notCurrentNode = Vegawallet.currentNodeUrl !== newNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) Vegawallet.netWorkNodes.push(newNodeUrl); 
        res.json({ note: 'New node registered successfully.' });
    });







    //register multupile nodes at ones 
        app.post('/register-nodes-bulk', function(req,res){
            const allNetWorkNodes = req.body.allNetWorkNodes;
            allNetWorkNodes.forEach(netWorkNodeUrl=> {
            const nodeNoteAlreadyPresent =  Vegawallet.netWorkNodes.indexOf(netWorkNodeUrl) == -1 ;
            const notCurrentNode = Vegawallet.currentNodeUrl !== netWorkNodeUrl;       
                if (nodeNoteAlreadyPresent && notCurrentNode) Vegawallet.netWorkNodes.push(netWorkNodeUrl);
            });
        res.json({ note: 'bulk registration successfuly.'});

    });







app.listen(port, function(){
    console.log(`listing on port ${port}...`);
});
