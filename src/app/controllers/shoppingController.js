const   Product = require('../models/product'),
        Shopping = require('../models/shopping'),
        crypto = require('crypto'),
        Order = require('../models/order'),
        CashierStatus = require('../models/cashierStatus')


cashierPrice = async (req, res) => 
{
    const prods  = req
    let price = []

    //Percorre o array para buscar no banco de dados
    for (let code of Object.keys(prods)) {

        var qtd = prods[code]

        //Consulta no banco
        user = await Product.find({ _id: code })

        //Acrescentar no array
        price.push(user[0].price * qtd)
    }

    //Somar array
    const total = price.reduce((a, b) => a + b, 0)

    //arredondar valor 55.549 -> 55.5
    price = total.toFixed(2);

    //retorna em formato NUMBER
    return (+price)
}


exports.addClient = async (req,res) => {

    //recebe os parametros
    const { idClient } = req.body
    
    //se não existir session cria
    if(!req.session.cart){
        req.session.cart = {}
        req.session.cart.prod = {}
        req.session.cart.price = null
        req.session.cart.client = null
    }
    req.session.cart.client = idClient
    
    res.status(200).json({'message' : req.session.cart})
}


exports.addCart = async (req,res) => {

    //recebe os parametros
    const {codeProd, qtdProd } = req.body
    
    //se não existir session cria
    if(!req.session.cart){
        req.session.cart = {}
        req.session.cart.prod = {}
        req.session.cart.price = 0
    }

    //Se não existir uma session para o produto XYZ criar
    if(!req.session.cart.prod[codeProd]){

        req.session.cart.prod[codeProd] = (+qtdProd)

        //Se não acrescenta a quantidade, atualiza
    } else {

        req.session.cart.prod[codeProd] = (+req.session.cart.prod[codeProd]) + (+qtdProd)

    }
    const price = await cashierPrice(req.session.cart.prod)
    req.session.cart.price = price

    res.status(200).json({'message' : req.session.cart})
}


exports.delCart = async(req,res) =>
{
    const {codeProd, qtdProd } = req.body
    
    //Se o produto exitir ira subtrair a quantidade solicitada
    if(req.session.cart.prod[codeProd]){

        req.session.cart.prod[codeProd] = (+req.session.cart.prod[codeProd]) - (+qtdProd)

    }

    //Se o quantidade for megativa então irá manter como zero
    if(req.session.cart.prod[codeProd] < 0){

        req.session.cart.prod[codeProd] = 0

    }
    
    //recalcula o valor total do carrinho
    const price = await cashierPrice(req.session.cart.prod)
    req.session.cart.price = price

    res.status(200).json({'message' : req.session.cart})
}


exports.finishCart = async (req,res) =>
{
    const prods  = req.session.cart.prod
    const grossPrice = req.session.cart.price

    const portion = req.body.portion
    const typeReceived = req.body.typeReceived
    const received = req.body.received
    const liquidPrice = req.session.cart.price - received
    const balance = liquidPrice / portion
    const typePayment = req.body.typePayment
    const idClient = req.session.cart.client
    const idUser = req.body.idUser
    
    //Generate hash
    var dateString = new Date().toString()
    var title = crypto.createHash('md5').update(dateString).digest('hex')

    //Valor Recebido
    const date = Date.now()
     
    let receivedResult
    //Grava o valor recebido
    receivedResult = await receivedCashier(typeReceived, title, received, idUser, idClient, date)

    if(!receivedResult){
        res.status(200).json({'message' : 'Received'})
    }

    //Gravar os produtos comprados
    for (let code of Object.keys(prods)) {

        var qtd = prods[code]

        var shopping = new Shopping({
            'idClient': idClient,
            'idProduct': code,
            'qtdProduct': qtd,
            'title': title,
            'dateCompra':date
        })
        
        //Insere 1 a 1 no banco
        try{

            shopping.save()

        }catch(error){

            res.status(500).json({'message' : 'Not Products on Cart'})

        }
        
    }

    //Data para o vencimento da parcela/título
    var myDate2 = new Date()

    //Alterar o dia de Vencimento
    myDate2.setDate(24)

    for (var i = 0, port = portion; i < port; i++) {

        //Data para o vencimento da parcela/título= soma 1 mês
        console.log(myDate2.toLocaleDateString())
        myDate2.setMonth(myDate2.getMonth() + 1)

        //Salvar as parcelas
        var order = new Order({
            'title': title,
            'maturity': myDate2,
            'typePayment': typePayment,
            'datePurchase': date,
            'Payment': 'Payment',
            'grossPrice': grossPrice,
            'liquidPrice': liquidPrice,
            'balance': balance,
            'portion': i,
            'idClients': idClient,
            'idUser': idUser
        })    
        //Insere 1 a 1 no banco
        try{

            order.save()

        }catch(error){

            res.status(500).json({'message' : 'Not created order'})
            
        }
    }
    
    //Destroy o carrinho após inserir no banco
    try{

        req.session.destroy(function(err) {  })

    }catch(error){
        
        res.status(500).json({'message' : 'Cart not clear'})

    }

    res.status(200).json({'message' : 'Success'})
}


receivedCashier = async ( typeReceived, title, received, idUser, idClient, date ) => {

    //Salvar as parcelas 
    const cashier = new CashierStatus({
        typeCashier: typeReceived,
        title: title,
        price: received,
        idUser: idUser,
        idClient: idClient,
        dateCashier: date
    })

    try{

        cashier.save()

    }catch(error){

        res.status(500).json({'message' : 'Not Received'})

    }

    return true
}


exports.receivedValue = async(req) => {
    let { idUser, received } = req.body
    let orders, change, balance

    //Consulta no banco $gt = param > 0
    orders = await Order.find({ idClients: idUser, balance: { $gt: 0 } })

    //percorre todos os resultados
    for (let code of Object.keys(orders)) {
 
        //Se o saldo da parcela for maior que 0 e o valor recebido ainda for maior 0
        if(orders[code].balance > 0 & received > 0){

            //Calcula o saldo
            change = received - orders[code].balance

            //se o troco for negativo salva o valor restante
            if(change < 0){

                balance = -change>0 ? -change : change

            //se o troco for posivo zera o saldo
            } else {

                balance = 0

            }

            //alterar valor recebido 
            received = change

            //Altera no banco de dados o balanço
            orders[code].balance = balance            
            // console.log("Valor devido: ", orders[code].balance, " - Troco: ", change, " Positivo: ", received, " Salvar no banco: ", balance)
            
            try{

                orders[code].save()

            }catch(error){

                res.status(500).json({'message' : 'Not Received'})

            }
        }
    }
}