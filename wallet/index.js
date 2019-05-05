const {INITIAL_BALANCE} = require('../config');
const Util = require('../util');
const Transaction = require('./transaction');

class Wallet{

    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = Util.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        PublicKey: ${this.publicKey.toString()} 
        Balance: ${this.balance}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(receipent, amount, transactionPool){

        console.log(amount, this.balance);
        
        if( amount > this.balance){
            console.log(`Amount: ${amount} exceeds the current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this,amount,receipent);
        }else{
            transaction = Transaction.newTransaction(this, receipent, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }
}



module.exports = Wallet;