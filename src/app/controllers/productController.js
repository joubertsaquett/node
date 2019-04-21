
const   Product = require('../models/product');

exports.listAll = async (req, res) => {

    product = await Product.find();

    return res.status(200).send({ product });    
}

exports.listName = async (req, res) => {

    const { name } = req.body;

    //Expressão para encontrar parte de um valor
    let query = { name: new RegExp(name) }, product;

    product = await Product.findOne( query );

    return res.status(200).send({ product });    
}

exports.listCode = async (req, res) => {

    const { code } = req.body;

    //Expressão para encontrar parte de um valor
    let query = { code: code }, product;

    product = await Product.findOne( query );

    return res.status(200).send({ product });    
}

exports.create = async (req,res) =>
{    
    const { code,name, price, amount, size, alert } = req.body;

    //grava no banco
    var product = new Product({
        'code':code,
        'name':name,
        'price':price,
        'amount':amount,
        'size':size,
        'alert':alert
    });

    //gravas no Banco
    try {

        await product.save();

    } catch(error){

        return res.status(400).send({ error: 'Error ao cadastrar' });

    }

    return res.status(200).send({ error: 'Cadastro realizado' });
}

exports.alter = async (req,res) =>
{
    
    const {id, code,name, price, amount, size, alert } = req.body;

    //Busca o email
    let product;
    try {

        product = await Product.findOne({ id });      
        console.log(product)
    } catch(error){

        return res.status(400).send({ error: 'Product not found.' });

    }


    //Verifica se a consulta retornou null
    if(!product)
        return res.status(400).send({ error: 'Product not found.' });

    //alterar    
    product.code = code,
    product.name = name,
    product.price = price,
    product.amount = amount,
    product.size = size,
    product.alert = alert

    try {

        await product.save();

    } catch(error){

        return res.status(400).send({ error: 'Error not alter' });

    }

    return res.status(200).send({ error: 'Altered success' });

}

