// Importations des node_modules
const express = require('express');
const mongoose = require('mongoose');

// Utilisation de express
const app = express();


// Connection à la base de données
mongoose.connect('mongodb://127.0.0.1:27017/Piquante',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//MiddleWares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

// Les requêtes que je vais devoir renseigner
// Création d'un compte
// POST / api / auth / signup

// Login de l'utilisateur
// POST / api / auth / login

// Récupération de toutes les sauces
// GET / api / sauces

// Récupération d'une sauce unique
// GET / api / sauces /: id

// Ajout d'une sauce
// POST / api / sauces

// Modification d'une sauce
// PUT / api / sauces /: id

// Suppression d'une sauce
// DELETE / api / sauces /: id

// Like/Dislike d'une sauce
// POST / api / sauces /: id / like


module.exports = app;