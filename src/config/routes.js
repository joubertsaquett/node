const   classe = require("../app/controllers/classe"),
        authController = require("../app/controllers/authController"),
        clientController = require("../app/controllers/clientController"),
        productController = require("../app/controllers/productController"),
        expenseController = require("../app/controllers/expenseController"),
        shoppingController = require("../app/controllers/shoppingController"),
        project = require("../app/controllers/projectController");

const   authGuard = require('../app/middlewares/auth'),
        middle = require('../app/middlewares/middle');

router = (app) =>
{   
    app.get('/', authController.test)

    app.post('/listemail', authController.listEmail)
    app.post('/register', authController.register)
    app.post('/authenticate', authController.authenticate)
    app.post('/forgot_password', authController.forgot_password)
    app.get('/passwordresetvalidate/token/:token/email/:email', authController.passwordResetValidate)
    app.post('/passwordereset/', authController.passwordeReset)

    app.get('/api',[middle.requestTime, authGuard.authGuard], classe.retornoPadrao)
    
    //Client
    app.get('/client/listAll', clientController.listAll)
    app.post('/client/listName', clientController.listName)
    app.post('/client/create', clientController.create)
    app.post('/client/alter', clientController.alter)

    //Products
    app.get('/product/listAll', productController.listAll)
    app.post('/product/listName', productController.listName)
    app.post('/product/listCode', productController.listCode)
    app.post('/product/create', productController.create)
    app.post('/product/alter', productController.alter)

    //Exprenses
    app.get('/expense/listAll', expenseController.listAll)
    app.post('/expense/listName', expenseController.listName)
    app.post('/expense/create', expenseController.create)
    app.post('/expense/alter', expenseController.alter)
    
    app.post('/addClientController', shoppingController.addClient)
    app.post('/addCartController', shoppingController.addCart)
    app.post('/delCartController', shoppingController.delCart)
    app.post('/finishCartController', shoppingController.finishCart) 
    app.post('/receivedValueController', shoppingController.receivedValue) 
    
    
}

module.exports =  router