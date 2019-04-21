const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

exports.authGuard = (req, res, next) => 
{
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ erro: 'No token provided' });

    //Bearer #token
    //Divide o token em 2 parter pelo SPACE
    const parts = authHeader.split(' ');

    //Valida se existem 2 partes
    if(!parts.length === 2)
        return res.status(401).send({ error: "Token error" });

    const [ scheme, token ] = parts;

    //Valida se está escrito Bearer, 'i' case sencitive
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token malformatted" });

    //Verifica o token, se possui o SECRET 
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({ error: 'Token invalid' });
        //retorn o id
        req.userId = decoded.id;
        return next();
    });
}
