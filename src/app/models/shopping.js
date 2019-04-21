const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    idClient: {
        type: String,
        require: true,
    },
    idProduct:{
        type: String,
        required: true,
    },
    qtdProduct:{
        type: Number,
        required: true,
    },
    title:{
        type: String,
    },
    dateCompra: {
        type: Date,
    }
},{timestamps : true});


const User = mongoose.model('Shopping', UserSchema);

module.exports = User;