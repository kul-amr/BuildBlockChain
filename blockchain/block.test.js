const Block = require('./block');

describe('Block',()=>{
    
    let data,lastBlock, block;

    beforeEach(()=>{
        data = 'testData';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });

    it('sets the `data` to passed input',()=>{
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to the hash of last block',()=>{
        expect(block.lastHash).toEqual(lastBlock.currentHash);
    });

    it('generates hash matching difficulty const',()=>{
        expect(block.currentHash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });
    
    it('lowers the difficulty for slow mined blocks',()=>{
        expect(Block.adjustDifficulty(block.timestamp+3600,block)).toEqual(block.difficulty-1);
    });


    it('increases the difficulty for fast mined blocks',()=>{
        expect(Block.adjustDifficulty(block.timestamp,block)).toEqual(block.difficulty+1);
    });


});