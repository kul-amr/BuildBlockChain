const websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = []; 
    }

    listen(){
        const server = new websocket.Server({port : P2P_PORT});
        server.on('connection',socket => this.connectSocket(socket));

        this.connectToPeers();
        console.log(`listening for p2p connections on:  ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer =>{
            const socket = new websocket(peer);
            socket.on('open',()=> this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('socket connected');

        this.messageHandler(socket);
        this.sendChain(socket);
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    messageHandler(socket){
        socket.on('message', message=>{
            const data = JSON.parse(message);
            // console.log('data is : ', data);
            this.blockchain.replaceChain(data);
        });
    }

    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;