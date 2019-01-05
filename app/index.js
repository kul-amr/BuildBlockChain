const express = require('express');
const Blockchain = require('../blockchain');
const bodyparser = require('body-parser');
const P2pServer = require('./p2p-server');


const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyparser.json());

app.get('/blocks',(req,res)=>{
    res.json(blockchain.chain);
});

app.post('/mine',(req,res)=>{

    const block = blockchain.addBlock(req.body.data);
    console.log('new block added : ', block.toString())

    res.redirect('/blocks');
});

app.listen(HTTP_PORT,()=>console.log('listening on port : ', HTTP_PORT));
p2pServer.listen();