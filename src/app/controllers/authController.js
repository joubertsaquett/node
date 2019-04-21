/*const express = require('express');

const router = express.Router();*/

const   bcrypt = require('bcryptjs'),
        crypto = require('crypto'),
        authConfig = require('../../config/auth.json'),
        jwt = require('jsonwebtoken'),
        User = require('../models/User'),
        mailer = require('../../modules/mailer'),
        config = require('../../config/config.json')


exports.test = (req, res)  =>{
    return res.status(200).send({ error: 'Read Success!'});
}


exports.generateToken = (params = {}) =>{
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });    
}

generateToken20 = () => {
    return crypto.randomBytes(20).toString('hex');
}


exports.listEmail = async (req, res) => {    
    const { email } = req.body;
    let query = { email: email}, user;
    user = await User.findOne( query );
    return res.status(200).send({ user });    
}


exports.register = (req, res) =>{
    const { email,name, password } = req.body;
    //console.log(email);

    //grava no banco
    var user = new User({
        'name':name,
        'email':email,
        'password':password
    });

    user.save().then(data => 
    {
        return res.send({
            user: {
                'id':data._id,
                'name':name,
                'email':email,
            },
            token: exports.generateToken({ user: data._id })
        }); 
    }).catch(error => 
    {
        console.log(error);
        return res.status(403).send({ error: 'User already exist', errorObj: error });
    });
}

//Rota de autenticação
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    //pesquisa se existe um no banco com o email
    let query = { email: email}, user;
    try {
        user = await User.findOne( query );
    } catch(error) {
        return res.status(403).send({ error: 'Not found.', errorObj: error});
    }
    
    //Valida se a senha
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' });

    //apaga o valor da senha
    user.password = undefined;

    //retorna as informações de login
    return res.status(200).send({ error: 'Logged', user, token: exports.generateToken({ id: user.id }) });
}

exports.forgot_password = async (req, res) => {
    const { email } = req.body;

    //Busca o email
    let user
    try {
        user = await User.findOne({ email });
    } catch(error){
        return res.status(400).send({ error: 'User not found' });
    }
    // gera um token para alteração
    const token = generateToken20();

    const now = new Date();
    now.setHours(now.getHours() + 1);
    
    // realizar um update no token de reset e no tempo de expiração
    //pegar o objeto e alterar o valor, depois usar o save() para realizar alteração
    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    try {
        await user.save();
    } catch(error){
        return res.status(400).send({ error: 'Error login' });
    }

    const subject = "Forgot Password"
    const content = "<h1>Esqueceu sua senha? Não se preocupe. Clique <a href=\"" + config.url + "/reset/" + token + "\">aqui</a>.</h1>"
    
    // envia o email
    try{
        const result = await mailer.sendMail( email, subject, content )
        if(!result)
            return res.status(400).send({ error: 'Mail not send, try again' });         
        return res.status(200).send({ error: 'Mail send' });

    } catch(err){
        res.status(400).send({ error: 'Erro on forgot password, try again' });
    }
}


exports.passwordResetValidate = async (req, res) =>{
    const { email, token } = req.params;
    const now = new Date();

    //Busca o email
    let user
    try {
        user = await User.findOne({
            email: email,
            passwordResetToken: token
        });        
    } catch(error){
        return res.status(400).send({ error: 'User or token not found' });
    }
    
    //Verifica se a consulta retornou null
    if(!user)
        return res.status(400).send({ error: 'Token expired' }); 

    // valida de token é válido
    if(await user.passwordResetExpires <= now )
        return res.status(400).send({ error: 'Token expired' }); 
    return res.status(200).send({ error: 'Token ok', token });   
}


exports.passwordeReset = async (req, res) =>{
    const { email, password, tokenreset } = req.body;
    
    const now = new Date();

    //Busca o email
    let user
    try {
        user = await User.findOne({
            email, 
            passwordResetToken: tokenreset
        });        
    } catch(error){
        return res.status(400).send({ error: 'User or token not found' });
    }

    //Verifica se a consulta retornou null
    if(!user)
        return res.status(400).send({ error: 'Token expired' }); 

    // valida de token é válido
    if(await user.passwordResetExpires <= now )
        return res.status(400).send({ error: 'Token expired' });

    //alterar a senha
    user.password = password
    user.passwordResetExpires = now

    try {
        await user.save();
    } catch(error){
        return res.status(400).send({ error: 'Error login' });
    }
    return res.status(200).send({ error: 'Password reset success' });
}