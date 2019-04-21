
const   Client = require('../models/client');

exports.listAll = async (req, res) => {

    user = await Client.find();

    return res.status(200).send({ user });    
}

exports.listName = async (req, res) => {

    const { email } = req.body;

    //Expressão para encontrar parte de um valor
    let query = { email: new RegExp(email) }, user;

    user = await Client.findOne( query );

    return res.status(200).send({ user });    
}

exports.create = async (req,res) =>
{    
    const { email,name, CPF, dateDefault, phone, dateBirth} = req.body;

    console.log(req.body)
    //grava no banco
    var user = new Client({
        'name':name,
        'email':email,
        'CPF':CPF,
        'dateDefault':dateDefault,
        'phone':phone,
        'dateBirth':dateBirth
    });
    //gravas no Banco
    try {

        await user.save();

    } catch(error){

        return res.status(400).send({ error: 'Error ao cadastrar' });

    }

    return res.status(200).send({ error: 'Cadastro realizado' });
}

exports.alter = async (req,res) =>
{
    
    const {id, email, name, CPF, dateDefault, phone, dateBirth} = req.body;

    //Busca o email
    let client;
    try {

        client = await Client.findOne({ id });      
        console.log(client)
    } catch(error){

        return res.status(400).send({ error: 'Client not found.' });

    }


    //Verifica se a consulta retornou null
    if(!client)
        return res.status(400).send({ error: 'Client not found.' });

    //alterar    
    client.name = name,
    client.email = email,
    client.CPF = CPF,
    client.dateDefault = dateDefault,
    client.phone = phone,
    client.dateBirth = dateBirth

    try {

        await client.save();

    } catch(error){

        return res.status(400).send({ error: 'Error not alter' });

    }

    return res.status(200).send({ error: 'Altered success' });

}

