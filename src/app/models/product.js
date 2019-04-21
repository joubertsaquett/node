const mongoose = require('../../database/index');

const UserSchema = new mongoose.Schema({
    //codigo
    code: {
        type: String,
        require: true,
    },
    name:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    //quantidade
    amount:{
        type: Number,
    },
    size:{
        type: String,
    },
    alert:{
        type: String,
    }
},{timestamps : true});


const User = mongoose.model('Product', UserSchema);

module.exports = User;