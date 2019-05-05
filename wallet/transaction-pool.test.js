const TransactionPool= require('./transaction-pool');
const Tansaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool',()=>{
    let tp, wallet, transaction;

    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Tansaction.newTransaction(wallet,'rand-4ddr',30);
        tp.updateOrAddTransaction(transaction);
    });

    it('adds a transaction to the pool',()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool',() => {
        const oldTran = JSON.stringify(transaction);
        const newTran = transaction.update(wallet,'foo-rand',40);
        tp.updateOrAddTransaction(newTran);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTran.id))).not.toEqual(oldTran);

    });
});