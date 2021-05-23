const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization && authorization.split(' ')[1];
    if (token == null) {
        res.render('login');
    } 

    jwt.verify(token, process.env.JWS_ACCESS_KEY, (err, user) => {      
        if (err) {
            res.render('login');
        }

        req.user = user;
        next();
    })
}

module.exports = auth;