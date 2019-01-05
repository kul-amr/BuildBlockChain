const Block = require('./block');

// let blockTimestamp = new Date('2018-12-30').getTime();

// const block = new Block(blockTimestamp,'lasthash','currhash','testdata');

// console.log(block.toString());

// console.log(Block.genesis().toString())


const testBlock = Block.mineBlock(Block.genesis(),'myFirstTestBlock');
console.log(testBlock.toString()) 