const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const blockchain =require('./blockchain');
const Vegawallet=new blockchain();
const uuid = require('uuid/v1');
const nodeAddress = uuid().split('-').join('');
const port = process.argv[2];
const rp = require('request');


app.use (bodyparser.json()); //
app.use (bodyparser.urlencoded({extended:false})); 

   


app.get('/blockchain', function (req, res) {
     res.send(Vegawallet);
});



//creat a new transaction
    app.post('/transaction', function (req, res){
    const newTransaction= req.body;
    const blockIndex = Vegawallet.addTransactionToPendingTransactions(newTransaction);
        res.json({note: `transaction will be add  in block ${blockIndex}.`});
}); 



// broadcast transaction

    app.post('/transaction/broadcast', function(req,res){
        const newTransaction = Vegawallet.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
        Vegawallet.addTransactionToPendingTransactions(newTransaction);

        const requestPromises= [];
        Vegawallet.networkNodes.forEach(netWorkNodeUrl => {
            const requestOptions = {
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
app.get('/mine', function(req, res) {
	const lastBlock = Vegawallet.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: Vegawallet.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = Vegawallet.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = Vegawallet.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = Vegawallet.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	Vegawallet.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: Vegawallet.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
});




    //jey block jdid
    //nchoufou esq 3ando l hash e s7i7 w index e s7i7
    //et alors n7otto fi chain w nfaragh l pending transactions
    //w nraja3 res feha ok
    // sinon nrajja3 res feha block rejected
    app.post('/receive-new-block', function (req,res) {
        const newBlock = req.body.newBlock;
        const lastBlock= Vegawallet.getlastblock();
        const correctHash=lastBlock.hash === newBlock.previousBlockHash;
        const correctIndex= lastBlock['index'] +1 === newBlock['index'];
            
        if  (correctHash && correctIndex){
             Vegawallet.chain.push(newBlock);
             Vegawallet.pendingtransaction = [];
            res.json({
                note:'new block received and accepted',
                newBlock: newBlock
            });
        }  else {
            res.json({
                note:'new block rejected',
                newBlock: newBlock
            });
        } 
    });




    // register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (Vegawallet.networkNodes.indexOf(newNodeUrl) == -1) Vegawallet.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	Vegawallet.networkNodes.forEach(netWorkNodeUrl => {
		const requestOptions = {
			uri: netWorkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...Vegawallet.networkNodes, Vegawallet.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});





  //recive and register a node with the network

    app.post('/register-node', function(req, res) {
        const newNodeUrl = req.body.newNodeUrl;
        const nodeNotAlreadyPresent = Vegawallet.networkNodes.indexOf(newNodeUrl) == -1;
        const notCurrentNode = Vegawallet.currentNodeUrl !== newNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) Vegawallet.networkNodes.push(newNodeUrl); 
        res.json({ note: 'New node registered successfully.' });
    });







    //register multupile nodes at ones 
        app.post('/register-nodes-bulk', function(req,res){
            const allNetworkNodes = req.body.allNetworkNodes;
            allNetworkNodes.forEach(netWorkNodeUrl=> {
            const nodeNoteAlreadyPresent =  Vegawallet.networkNodes.indexOf(netWorkNodeUrl) == -1 ;
            const notCurrentNode = Vegawallet.currentNodeUrl !== netWorkNodeUrl;       
                if (nodeNoteAlreadyPresent && notCurrentNode) Vegawallet.networkNodes.push(netWorkNodeUrl);
            });
        res.json({ note: 'bulk registration successfuly.'});

    });



    app.get('/consensus', function(req,res){
        const   requestPromises = [];
        Vegawallet.networkNodes.forEach(networkNodeUrl => {
            const   requestOptions = {
                uri: networkNodeUrl +'/Blockchain',
                method: 'GET',
                json: true
            }

            requestPromises.push(rp(requestOptions));
        });
        Promise.all(requestPromises)
         .then(Blockchain => {          // access for all of the blockchain
             const currentChainLength = Vegawallet.chain.length;        // toul l blockhain n7otto fi variable
             let maxChainLength = currentChainLength;   
             let newLongestChain = null;
             let newPendingTransactions = null;

             Blockchain.forEach(Blockchain => {         // ken thamma ma atwel twalli hiya li titfact fil var
                if (Blockchain.chain.length > maxChainLength){
                    maxChainLength = Blockchain.chain.length;
                    newLongestChain
                };
             });

             if (!newLongestChain || (newLongestChain && !Vegawallet.chainIsValid(newLongestChain)))
             res.json ({
                 note: 'current chain has not been replaced.',
                 chain: Vegawallet.chain
             });

            
             else {
                 Vegawallet.chain = newLongestChain;
                 Vegawallet.pendingTransactions = newPendingTransactions;
                 res.json({
                     note: 'this chian has been replaced.',
                     chain: Vegawallet.chain
                 });

             }
         });
    });

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////  Block explorer  /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    

    app.get ('/block/:blockHash', function(req,res){
        const blockHash = req.params.blockHash;
        const correctBlock = Vegawallet.getBlock(blockHash);
        res.json({
            block: correctBlock
        });
    });




    app.get ('/transaction/:transactionID', function(req,res){
        const transactionID = req.params.transactionID;
        const transactionData = Vegawallet.getTransaction(transactionID);
            res.json({
                transaction: transactionData.transaction,
                block: transactionData.block
            });
    });     



    app.get ('/adress/:adress', function(req,res){

        const adress = req.params.transactionID;
        const adressData = Vegawallet.getAddressData(adress);
        res.json({
            adressData: adressData
        });
    }); 



    app.get('/block-explorer', function(req, res){
        res.sendFile('./block-explorer/explorer.html',{ root: __dirname});
    });




app.listen(port, function(){
    console.log(`listing on port ${port}...`);
});
// longest chain rule