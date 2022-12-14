// Générateur/Vérificateur de Hashage de mot de passe
const bcrypt = require("bcrypt")
// Générateur/Vérificateur/Décodeur de JWT
const jwt = require('jsonwebtoken');
// Importation du modèle User
const User = require('../models/users');

// Signup de l'utilisateur - Exporté dans routes
exports.signup = (req, res, next) => {
    // Le package bcrpyt permet un cryptage sécurisé du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Login de l'utilisateur - Exporté dans routes
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Compare le Password reçu avec le hash dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le Password est invalide
                    if (!valid) {
                        // console.log(req.body);
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                    // console.log(req.body);
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

