const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    typeCashier: {
        type: String,
        require: true,
    },
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    idUser:{
        type: String,
    },
    idClient:{
        type: String,
    },
    dateCashier:{
        type: Date,
    }
},{timestamps : true});


const User = mongoose.model('cashierStatus', UserSchema);

module.exports = User;