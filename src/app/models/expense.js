const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    //Descrição
    description: {
        type: String,
        require: true,
    },
    //Valor
    price:{
        type: Number,
        required: true,
    },
    //Vencimento
    maturity:{
        type: Date,
        required: true,
    },
    //Saldo
    balance:{
        type: Number,
    }
},{timestamps : true});

//Despesas
const User = mongoose.model('Expense', UserSchema);

module.exports = User;