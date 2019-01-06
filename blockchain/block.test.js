const Block = require('./block');
const { DIFFICULTY } = require('../config');

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
        expect(block.currentHash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
        console.log(block.toString());
    });
    
});