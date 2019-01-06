const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');


class Block {
    constructor(timestamp, lastHash, currentHash, data, nonce){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.currentHash = currentHash;
        this.data = data;
        this.nonce = nonce;
    }

    toString() {
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Current Hash: ${this.currentHash.substring(0,10)}
            Nonce : ${this.nonce}
            Data: ${this.data}`;
    }

    static genesis(){
        return new this('Genesis timestamp','-------------','f1r57-h45h',[],0);
    }

    static mineBlock(lastBlock,data){
        let currHash, timestamp; 
        const lastHash = lastBlock.currentHash;
        
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            currHash = Block.getHash(timestamp,lastHash,data, nonce);

        }while(currHash.substring(0,DIFFICULTY) !== '0'.repeat(DIFFICULTY));
        

        return new this(timestamp,lastHash,currHash,data, nonce);
    }

    static getHash(timestamp,lastHash,data, nonce){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    static blockHash(block){
        const {timestamp, lastHash, data, nonce} = block;

        return Block.getHash(timestamp, lastHash, data, nonce);
    }
}


module.exports = Block;