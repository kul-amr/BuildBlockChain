const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, currentHash, data){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.currentHash = currentHash;
        this.data = data;
    }

    toString() {
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Current Hash: ${this.currentHash.substring(0,10)}
            Data: ${this.data}`;
    }

    static genesis(){
        return new this('Genesis timestamp','-------------','f1r57-h45h',[]);
    }

    static mineBlock(lastBlock,data){
        const timestamp = Date.now();
        const lastHash = lastBlock.currentHash;
        const currHash = Block.getHash(timestamp,lastHash,data);

        return new this(timestamp,lastHash,currHash,data);
    }

    static getHash(timestamp,lastHash,data){
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block){
        const {timestamp, lastHash, data} = block;

        return Block.getHash(timestamp, lastHash, data);
    }
}


module.exports = Block;