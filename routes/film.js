const express = require('express');
const kontroler = require('../controller/film');

const router = express.Router();

router.use(express.json());

router.get('/', kontroler.showFilm);
router.post('/novi', kontroler.newFilm);
router.post('/delete', kontroler.deleteFilm);
router.post('/update', kontroler.updateFilm);

module.exports = router;