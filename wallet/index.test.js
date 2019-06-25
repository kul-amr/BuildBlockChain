const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const {INITIAL_BALANCE} = require('../config');

describe('wallet',()=> {
    
    let wallet, tp,bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, receipent;
        
        beforeEach(() => {
            sendAmount = 50;
            receipent = 'rand-44-acc';
            transaction = wallet.createTransaction(receipent, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(()=>{
                sendAmount = 50;
                receipent = 'rand-44-acc';
                transaction = wallet.createTransaction(receipent, sendAmount, bc, tp);
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

    describe('calculating balance', () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance for blockchain transactions matching receipent', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance*repeatAdd));
        });

        it('calculates the balance for blockchain transactions matching sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance*repeatAdd));
        });

        describe('receipent conducts a transaction', () => {
            let subtractBalance, receipentBalance;
            beforeEach(() => {
                tp.clear();
                subtractBalance = 60;
                receipentBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to the receipent', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates the receipent balance only with transactions since its most recent transaction', () =>{
                    expect(wallet.calculateBalance(bc)).toEqual(receipentBalance - subtractBalance + addBalance);
                });
            });

        });
    });  
});