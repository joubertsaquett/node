const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    //titulo
    title: {
        type: String,
        require: true,
    },
    //vencimento
    maturity:{
        type: Date,
        required: true,
    },
    //tipo_pagamento
    typePayment:{
        type: String,
        required: true,
    },
    //data Compra
    datePurchase:{
        type: Date,
    },
    //pagamento
    Payment:{
        type: String,
    },
    //valorbruto
    grossPrice:{
        type: Number,
    },
    //valorliquid:{
    liquidPrice:{
        type: Number,
    },
    //saldo
    balance:{
        type: Number,
    },
    //parcela
    portion:{
        type: Number,
    },
    idClients:{
        type: String,
    },
    idUser:{
        type: String,
    }
},{timestamps : true});

//Pedido
const User = mongoose.model('Order', UserSchema);

module.exports = User;