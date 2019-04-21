
const   Expense = require('../models/expense');

exports.listAll = async (req, res) => {

    expense = await Expense.find();

    return res.status(200).send({ expense });    
}

exports.listName = async (req, res) => {

    const { name } = req.body;

    //Expressão para encontrar parte de um valor
    let query = { description: new RegExp(name) }, expense;

    expense = await Expense.findOne( query );

    return res.status(200).send({ expense });    
}

exports.create = async (req,res) =>
{    
    const { description,price, maturity, balance } = req.body;

    //grava no banco
    var expense = new Expense({
        'description':description,
        'price':price,
        'maturity':maturity,
        'balance':balance
    });
    
    //gravas no Banco
    try {

        await expense.save();

    } catch(error){

        return res.status(400).send({ error: 'Error not create' });

    }

    return res.status(200).send({ error: 'Created' });
}

exports.alter = async (req,res) =>
{
    
    const { id, description, price, maturity, balance } = req.body;

    //Busca o email
    let expense;
    try {

        expense = await Expense.findOne({ id });      
        console.log(expense)
    } catch(error){

        return res.status(400).send({ error: 'Expense not found.' });

    }


    //Verifica se a consulta retornou null
    if(!expense)
        return res.status(400).send({ error: 'Expense not found.' });

    //alterar    
    expense.description = description,
    expense.price = price,
    expense.maturity = maturity,
    expense.balance = balance

    try {

        await expense.save();

    } catch(error){

        return res.status(400).send({ error: 'Error not alter' });

    }

    return res.status(200).send({ error: 'Altered success' });

}

