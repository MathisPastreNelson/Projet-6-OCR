// La variable express nous permet d'utiliser les fonctionnalités du module Express. 
const express = require('express');
// La variable mongoose nous permet d'utiliser les fonctionnalités du module mongoose.
const mongoose = require('mongoose');
// La variable path nous permet d'utiliser les fonctionnalités du module path.
const path = require("path");
// La variable helmet  nous permet d'utiliser les fonctionnalités du module helmet.
const helmet = require('helmet')

// Routeurs
const userRoutes = require("./routes/users")
const sauceRoutes = require("./routes/sauces")

const app = express();

// Connection à MongoDB
mongoose.connect('mongodb+srv://Mathis:So82HFGZ0ZvNRN9c@atlascluster.1hkdzyx.mongodb.net/Piquante?retryWrites=true&w=majority',
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
// Intercepte les requetes  contenant un content-type JSON et met le contenu dans req.body
app.use(express.json());

// Helmet sécurise les en-tête HTTP
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
    }),
);

// Le chemin statique des images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;