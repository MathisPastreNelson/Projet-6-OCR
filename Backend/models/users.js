// Appel de Mongoose pour définir le schéma de la DataBase
const mongoose = require('mongoose');
// Assure que l'utilisateur n'existe pas dans la DataBase
const uniqueValidator = require('mongoose-unique-validator');

// Modèle de l'utilisateur
const userSchema = mongoose.Schema({
    // On s'assure que l'e-mail est unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Export controllers
module.exports = mongoose.model('User', userSchema);