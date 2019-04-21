const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    CPF:{
        type: String,
    },
    dateDefault:{
        type: String,
    },
    phone: {
        type: String,
    },
    dateBirth: {
        type: Date,
    }
},{timestamps : true});


const User = mongoose.model('Client', UserSchema);

module.exports = User;