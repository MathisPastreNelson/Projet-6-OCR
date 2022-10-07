// Appel de Mongoose pour définir le schéma de la DataBase
const mongoose = require('mongoose');

// Modèle de sauce
const sauceSchema = mongoose.Schema({
    // L'identifiant unique de l'utilisateur 
    userId: { type: String, required: true, unique: true },
    // Nom de la sauce
    name: { type: String, required: true },
    // Fabricant de la sauce
    manufacturer: { type: String, required: true },
    // Description de la sauce
    description: { type: String, required: true },
    // Le principal ingrédient épicé de la sauce,
    mainPepper: { type: String, required: true },
    // l'URL de l'image de la sauce téléchargée par l'utilisateur
    imageUrl: { type: String, required: false },
    // Nombre entre 1 et 10 décrivant la sauce
    heat: { type: Number, required: true },
    // Nombre d'utilisateurs qui aiment la sauce
    likes: { type: Number, required: false, default: 0 },
    // Nombre d'utilisateurs qui n'aiment pas la sauce
    dislikes: { type: Number, required: false, default: 0 },
    // Tableau des identifiants des utilisateurs qui ont aimé(= liked) la sauce
    usersLiked: { type: String, required: false },  //userId
    // Tableau des identifiants de utilisateurs qui n'ont pas aimé (= disliked) la sauce
    usersDisliked: { type: String, required: false }  //userId
});

// Exporté dans controllers
module.exports = mongoose.model('Sauce', sauceSchema);

