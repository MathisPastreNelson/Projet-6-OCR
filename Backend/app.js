// Importation des packages
const express = require('express');
const mongoose = require('mongoose');

// Routeurs
const userRoutes = require("./routes/users")
const sauceRoutes = require("./routes/sauces")

const app = express();
app.use(express.json());

// Connection à MongoDB
mongoose.connect('mongodb+srv://Mathis:So82HFGZ0ZvNRN9c@atlascluster.1hkdzyx.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    // Permet d'accéder à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Permet d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/auth", userRoutes);

module.exports = app;