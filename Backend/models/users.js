// Appel de Mongoose pour définir le schéma de la DataBase
const mongoose = require('mongoose');
// Assure que l'utilisateur n'existe pas dans la DataBase
const uniqueValidator = require('mongoose-unique-validator');

// Modèle de l'utilisateur
const userSchema = mongoose.Schema({
    // L'email unique de l'utilisateur 
    email: { type: String, required: true, unique: true },
    // Le password de l'utilisateur
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Exporté dans controllers
module.exports = mongoose.model('User', userSchema);