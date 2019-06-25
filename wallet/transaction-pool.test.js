const TransactionPool= require('./transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('./index');

describe('TransactionPool',()=>{
    let tp, wallet, transaction;

    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = wallet.createTransaction('rand-4ddr',30,tp);
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

    describe('mixing valid and corrupt transactions',  () =>{
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions];

            for(let i=0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction("rand-4-addrs",30,tp);
                if(i%2==0){
                    transaction.input.amount = 999999;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows diff in valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });
});