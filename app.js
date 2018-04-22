const express = require('express')
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const app = express()
const validator = require('express-validator');
const jwtVerifier = require('express-jwt');

const user = { email: 'demo@gmail.com', password: 1234 }
const secret = 'abigsecret'


function createToken(){
    // sign with default (HMAC SHA256)
    let expirationDate =  Math.floor(Date.now() / 1000) + 30 //30 seconds from now
    var token = jwt.sign({ userID: user.email, exp: expirationDate }, secret);
    return token;
}


app.use(validator());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/home',jwtVerifier({secret: secret}), (req, res) => {
    res.send('Congratulations, you made it to home');
})

app.post('/login', (req, res) => {
    req.checkBody('email', 'Not a valid email').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {
        if (req.body.email == user.email && req.body.password == user.password) {
            res.send(createToken())
        }else{
            res.sendStatus(400);
        }
    }
})

app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
        res.status(500).send(err.message);
	}
});

app.listen(8090, () => console.log('Example app listening on port 8090!'))