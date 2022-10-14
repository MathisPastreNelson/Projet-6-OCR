// Importation d'express pour avoir accès aux méthodes
const express = require('express');
// La fonction routeur de express
const router = express.Router();

// Logique métier des requêtes
const userCtrl = require('../controllers/users');

// Routes pour l'execution des requêtes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporté dans l'API
module.exports = router;