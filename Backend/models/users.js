const mongoose = require('mongoose');
// Assure que l'utilisateur n'existe pas dans la DataBase
const uniqueValidator = require('mongoose-unique-validator');

// Modèle utilisateur
const userSchema = mongoose.Schema({
    // On s'assure que l'utilisateur ne partage pas son e-mail avec un autre
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);