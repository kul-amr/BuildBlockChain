const express = require('express');
const Blockchain = require('../blockchain');
const bodyparser = require('body-parser');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');


const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain,tp);



app.use(bodyparser.json());

app.get('/blocks',(req,res)=>{
    res.json(blockchain.chain);
});

app.post('/mine',(req,res)=>{

    const block = blockchain.addBlock(req.body.data);
    console.log('new block added : ', block.toString())
    
    p2pServer.syncChains();
    
    res.redirect('/blocks');
});

app.get('/transactions', (req,res) => {
    res.json(tp.transactions);
});

app.post('/creatTransaction',(req,res) => {
    const {recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient,amount,tp);
    p2pServer.broadcastTransaction(transaction);
    return res.redirect('/transactions');
});

app.listen(HTTP_PORT,()=>console.log('listening on port : ', HTTP_PORT));
p2pServer.listen();