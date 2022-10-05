const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const userCtrl = require('../controllers/users');
const sauceCtrl = require("../controllers/sauces");

// Exporté dans l'API
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/', sauceCtrl.getAllSauce);
router.post('/', sauceCtrl.createSauce);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);

module.exports = router;