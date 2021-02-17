const express = require('express');
const kontroler = require('../controller/signature');

const router = express.Router();

router.use(express.json());

router.post('/novi', kontroler.newSignature);
router.post('/login', kontroler.login);
router.get('/logout', kontroler.logout);
router.get('/load', kontroler.load);

module.exports = router;