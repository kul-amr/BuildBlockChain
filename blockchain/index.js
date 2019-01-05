const Block = require('./block');

class BlockChain{

    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){

        const block = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain){

        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for(let i=1; i< chain.length; i++){
            const currBlock = chain[i];
            const lastBlock = chain[i-1];

            if(currBlock.lastHash !== lastBlock.currentHash || 
                currBlock.currentHash !== Block.blockHash(currBlock)){
                    return false;
                }

        }
        return true;
    }

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log('newchain is not longer than current chain');
            return;
        }else if(!this.isValidChain(newChain)){
            console.log('newchain is invalid');
            return;
        }

        console.log('replacing current chain with newchain');
        this.chain = newChain;

    }

}

module.exports = BlockChain;