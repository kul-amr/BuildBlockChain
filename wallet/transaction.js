const Util = require('../util');
const {MINING_REWARD} = require('../config');

class Transaction{

    constructor(){
        this.id = Util.id();
        this.input = null;
        this.outputs = [];
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction= new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction,senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet,recipient,amount){
        
        if(amount>senderWallet.balance){
            console.log(`Amount : ${amount} is greater than the available balance`);
            return
        }
        
        return Transaction.transactionWithOutputs(senderWallet,[
            {amount: senderWallet.balance-amount, address:senderWallet.publicKey},
            {amount, address: recipient}
        ]);

    }

    static rewardTransaction(minerWallet,blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount:MINING_REWARD,address:minerWallet.publicKey
        }]);

    }

    update(senderWallet,amount,recipient){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if(amount>senderOutput.amount){
            console.log(`Amount : ${amount} is greater than available balance`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount,address:recipient});
        Transaction.signTransaction(this,senderWallet);
        return this;
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp:  Date.now(),
            amount: senderWallet.balance,
            address:    senderWallet.publicKey,
            signature: senderWallet.sign(Util.hash(transaction.outputs)) 
        }
    }

    static verifyTransaction(transaction){
        return Util.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            Util.hash(transaction.outputs)
        );
    }

}

module.exports = Transaction;