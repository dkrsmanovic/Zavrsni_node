const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const joi = require('joi');
const history = require('connect-history-api-fallback');
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
const signatureRoutes = require('./routes/signature');
const komentarRoutes = require('./routes/komentar');
const filmRoutes = require('./routes/film');

app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const staticMiddleware = express.static(path.join(__dirname, './view/dist'));

app.use('/film',filmRoutes);
app.use('/signature',signatureRoutes);
app.use('/komentar',komentarRoutes);

app.use(staticMiddleware);
app.use(history({
    verbose: true
}));
app.use(staticMiddleware);

app.use('/', express.static(path.join(__dirname, './view/dist')));

app.use(function (req, res, next) {
    const err = new Error('Stranica ne postoji: ' + req.url);
    err.status = 404;
    next(err);
})



module.exports = app;