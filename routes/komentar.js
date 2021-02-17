const express = require('express');
const kontroler = require('../controller/komentar');

const router = express.Router();

router.use(express.json());

router.get('/', kontroler.showKomentar);

router.post('/novi', kontroler.newKomentar);
router.post('/delete', kontroler.deleteKomentar);
router.post('/update', kontroler.updateKomentar);

module.exports = router;