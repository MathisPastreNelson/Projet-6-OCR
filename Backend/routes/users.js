const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const userCtrl = require('../controllers/users');
const saucesCtrl = require("../controllers/sauces");

// Exporté dans l'API
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;