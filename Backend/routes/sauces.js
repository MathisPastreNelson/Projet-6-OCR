const express = require('express');
// La fonction routeur de express
const router = express.Router();

const auth = require("../middleware/auth")

const multer = require("../middleware/multer-config")
const sauceCtrl = require("../controllers/sauces");

// Exporté dans l'API
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;

// console.log("SAUCE ROUTE", sauceCtrl)