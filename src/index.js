const   express = require("express"),
        app = express(),
        router = require("./config/routes"),      
        config = require("./config/config"),
        bodyParser = require("body-parser"),
        session = require('express-session'),
        configSession = require('./config/session.json')
        MongoStore = require('connect-mongo')(session);


        var mongoose = require('mongoose');
//PORTA
const PORT = process.env.PORT = config.port
 

//ATIVAR body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

//CORS HTTP
app.disable('x-powered-by');
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

//SESSION
app.use(session({ 
    secret: configSession.secret, 
    resave: false, 
    saveUninitialized: true,
    cookie: { expires: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//ROUTER
router(app)

//PORT DEFINITION
app.listen(PORT,function(){
    console.log('Service run port:',PORT)
})


module.exports = app