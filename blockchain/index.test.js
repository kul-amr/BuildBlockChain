const BlockChain = require('./index');
const Block = require('./block');

describe('BlockChain', ()=>{
    let blockchain, blockchain2 ;

    beforeEach(()=>{
        blockchain = new BlockChain();
        blockchain2 = new BlockChain();
    });

    it('starts with genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a block',()=>{
        const data = 'testData';
        blockchain.addBlock(data);

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);
    });

    it('validates a valid/correct chain',()=>{
        blockchain2.addBlock('tempdata');
        
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
    });

    it('invalidates a chain with incorrect genesisi block',()=>{
        blockchain2.chain[0].data = 'wrongdata';

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('invalidates corrupt chain',()=>{
        blockchain2.addBlock('data');
        blockchain2.chain[1].data = 'rev data';

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('replaces the chain with valid new chain',()=>{
        blockchain2.addBlock('newdata');
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).toEqual(blockchain2.chain);
    });

    it('doesnot replace if newchain is not of greater length',()=>{
        blockchain.addBlock('orgdata');
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
});