const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const userCtrl = require('../controllers/users');
const sauceCtrl = require("../controllers/sauces");

// Exporté dans l'API
// router.get('/', auth, saucesCtrl.getAllSauces);