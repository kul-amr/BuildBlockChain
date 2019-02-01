const Util = require('../util')
const { DIFFICULTY, MINE_RATE } = require('../config');


class Block {
    constructor(timestamp, lastHash, currentHash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.currentHash = currentHash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Current Hash: ${this.currentHash.substring(0,10)}
            Nonce : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data: ${this.data}`;
    }

    static genesis(){
        return new this('Genesis timestamp','-------------','f1r57-h45h',[],0, DIFFICULTY);
    }

    static mineBlock(lastBlock,data){
        let currHash, timestamp; 
        const lastHash = lastBlock.currentHash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(timestamp, lastBlock );
            currHash = Block.getHash(timestamp,lastHash,data, nonce, difficulty);

        }while(currHash.substring(0,difficulty) !== '0'.repeat(difficulty));
        

        return new this(timestamp,lastHash,currHash,data, nonce, difficulty);
    }

    static adjustDifficulty(currTime, lastBlock){
    
        let { difficulty } = lastBlock;    
        difficulty = (lastBlock.timestamp + MINE_RATE)> currTime ? difficulty+1 : difficulty-1;
        return difficulty;
    }

    static getHash(timestamp,lastHash,data, nonce, difficulty){
        return Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    static blockHash(block){
        const {timestamp, lastHash, data, nonce, difficulty} = block;

        return Block.getHash(timestamp, lastHash, data, nonce, difficulty);
    }
}


module.exports = Block;