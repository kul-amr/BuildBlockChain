const Transaction = require('./transaction');
const Wallet = require('./index');


describe('Transaction', () => {
    let transaction, wallet, amount, recepient;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recepient = 'testrecp67';
        transaction = Transaction.newTransaction(wallet,recepient,amount);
    });

    it('output should match the `amount` substracted from balance', ()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('output the `amount` added to recepient',() =>{
        expect(transaction.outputs.find(output => output.address === recepient).amount).toEqual(amount);
    });

    it('input amount same balance of the wallet',() => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates correct transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates corrupt transaction', () => {
        transaction.outputs[0].amount=60000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transaction when amount is exceeding the balance', () => {
        
        beforeEach(() => {
            amount = 10000;
            transaction = Transaction.newTransaction(wallet,recepient,amount);
        });

        it('should not create the transaction', ()=>{
            expect(transaction).toEqual(undefined);
        });

    });

    describe('update the transaction', () => {
        let amount1, recepient1;

        beforeEach(()=>{
            amount1=70;
            recepient1='cfvghbjnkml';
            transaction = transaction.update(wallet,amount1,recepient1);
        });

        it('substracts the new amount from balance or sender output', ()=> {
            expect(transaction.outputs.find(output => output.address===wallet.publicKey).amount).toEqual(wallet.balance-amount-amount1);
        });

        it('outputs the amount for new recepient', ()=>{
            expect(transaction.outputs.find(output => output.address ===recepient1).amount).toEqual(amount1);
        });

    });

});