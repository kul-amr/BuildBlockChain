const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');


describe('wallet',()=> {
    
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, receipent;
        
        beforeEach(() => {
            sendAmount = 50;
            receipent = 'rand-44-acc';
            transaction = wallet.createTransaction(receipent, sendAmount, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(()=>{
                sendAmount = 50;
                receipent = 'rand-44-acc';
                transaction = wallet.createTransaction(receipent, sendAmount, tp);
            });

            it('doubles the `sendAmount` substracted from the wallet balance',() => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - sendAmount * 2);
            });
    
            it('clones the `sendAmount` output for the receipent', () => {
                expect(transaction.outputs.filter(output => output.address === receipent)
                .map(output => output.amount)).toEqual([sendAmount,sendAmount]);
            });
        });
    });
});