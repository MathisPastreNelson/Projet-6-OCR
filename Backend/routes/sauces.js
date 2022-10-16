// Importation d'express pour avoir accès aux méthodes
const express = require('express');
// La fonction routeur de express
const router = express.Router();

// Middleware d'assurance que l'utilisateur est bien log avant de faire des requêtes
const auth = require("../middleware/auth")
// Middleware de gestion des images des sauces
const multer = require("../middleware/multer-config")

// Logique métier des requêtes
const sauceCtrl = require("../controllers/sauces");

// Routes pour l'execution des requêtes incluants les middlewares
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Exporté dans l'API
module.exports = router;