var express = require('express')
var app = express()

app.get('/blockchain', function (req, res) {
});

app.post('/transaction', function(req, res){
});
res.send('it works...');

app.get('/mine', function(req,res){
});

app.listen(3000, function(){
    console.log('listing on port 3000...');
});