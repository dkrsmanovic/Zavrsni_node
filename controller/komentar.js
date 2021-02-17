const pool = require("../database");
const mysql = require('mysql');
const shema = require('../model/komentar');
const jwt = require('jsonwebtoken');
const config = require('../config');


module.exports.showKomentar = async function(req, res, next){
    let token = req.cookies['jwt'];
    console.log("showkomentar: " + token);
    jwt.verify(token, config.secret, function(_err, decoded) {
        if (_err) return res.status(401).send({message: 'Unauthorized!'});
        let user = decoded.id;
        try{
            pool.query('select * from komentar_komentar where user_id = ' + user + ' order by date desc', (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send({jsonData: rows});
            });
        }
        catch(err){
            next(err);
        }
    });
}


module.exports.newKomentar = async function(req, res, next) {
    let { error } = shema.validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let query = "insert into komentar_komentar (date, text, user_id) values (?, ?, ?)"
            let date = new Date();
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            let formated = mysql.format(query,[datum, req.body.text, decoded.id]);
            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from komentar_komentar where user_id = ' + decoded.id + ' order by date desc';

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

module.exports.deleteKomentar = async function(req, res, next) {
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            pool.query('delete from komentar_komentar where id =' + req.body.idkomentar + ' and user_id = ' + decoded.id, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from komentar_komentar where user_id = ' + decoded.id + ' order by date desc';
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

module.exports.updateKomentar = async function (req, res, next) {
    let date = new Date();
    let vals = {iduser: req.body.iduser, text: req.body.text, date: date};
    let { error } = shema.validate(vals);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        let token = req.cookies['jwt'];
        jwt.verify(token, config.secret, function(_err, decoded) {
            if (_err) return res.status(401).send({message: 'Unauthorized!'});
            let datum = date.toISOString().slice(0, 19).replace('T', ' ');
            pool.query('UPDATE komentar_komentar SET text = \"' + req.body.text + '\", date = \"' + datum + '\" WHERE id =' + req.body.idkomentar, (err, rows) => {
                if (err){
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    let query = 'select * from komentar_komentar where user_id = ' + decoded.id + ' order by date desc';
                    pool.query(query, (_err, rows) => {
                        if (_err){
                            res.status(500).send(_err.sqlMessage);
                        }
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