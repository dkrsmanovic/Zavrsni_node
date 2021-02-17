const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/film');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.showFilm = async function(req, res, next){
    try{
        let token = req.cookies['jwt'];
        console.log("showfilm: " + token);
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('select * from film_film where user_id = ' + decoded.id, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
            });
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.newFilm = async function (req, res, next) {
    let date = new Date();
    let values = {text: req.body.text, date: date, iduser: req.body.iduser, done: false }
    let { error } = shema.validate(values);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let query = "insert into film_film (text, user_id) values (?, ?)"
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            let formated = mysql.format(query,[req.body.text, decoded.id]);
            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from film_film where user_id=' + decoded.id;

                    pool.query(query, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send({jsonData: rows});

                    });
                }
            });
    });
    }
}

module.exports.deleteFilm = async function(req, res, next) {
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('delete from film_film where id=' + req.body.idfilm, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from film_film where user_id=' + decoded.id;
                    pool.query(query, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send({jsonData: rows});
                    });
                }
            });
    });
    }
    catch(err){
        next(err);
    }
}

module.exports.updateFilm = async function(req, res, next) {
    console.log("upfilm: " + req.body.done + ", " + req.body.idfilm);
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('UPDATE film_film SET done = ' + req.body.done +' WHERE id=' + req.body.idfilm, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
        });
    });
    }
    catch(err){
        next(err);
    }
}