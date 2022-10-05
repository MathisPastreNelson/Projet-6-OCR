// Générateur/Vérificateur/Décodeur de JWT
const jwt = require('jsonwebtoken');

// Exporté dans les routes nécessitant l'authentification
module.exports = (req, res, next) => {
    try {
        // Récupère le token dans la requête authorization du header
        const token = req.headers.authorization.split(' ')[1];
        // Permet de vérifier la validité d'un token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
        // Si authentification non valide
    } catch (error) {
        res.status(401).json({ error });
    }
};