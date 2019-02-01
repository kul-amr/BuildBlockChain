const Blockchain = require('./blockchain')

// let blockTimestamp = new Date('2018-12-30').getTime();

// const block = new Block(blockTimestamp,'lasthash','currhash','testdata');

// console.log(block.toString());

// console.log(Block.genesis().toString())


// const testBlock = Block.mineBlock(Block.genesis(),'myFirstTestBlock');
// console.log(testBlock.toString()) 

// const blockchain = new Blockchain();

// for(var i=0;i<=10;i++){
//     console.log(blockchain.addBlock(`data_${i}`).toString());
// }

const Wallet = require('./wallet')

const wallet = new Wallet();

console.log(wallet.toString());