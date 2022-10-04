// Générateur/Vérificateur/Décodeur de JWT
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupère l'authorisation après l'espace dans le HEADER
        const token = req.headers.authorization.split(' ')[1];
        // Permet de vérifier la validité d'un token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};