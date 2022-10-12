// Importation du modèle Sauce
const Sauce = require('../models/sauces');
// Importation de FS pour accéder aux fichier du serveur (les photos des sauces)
const fs = require('fs');
// console.log("fs test = ", fs.link)

exports.createSauce = (req, res, next) => {
    // Les données du formulaire de création vont dans une nouvelle sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log("Sauce Crée log  : ", sauceObject);
    // delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // _id: sauceObject._id
    });
    // Je sauvegarde la nouvelle sauce dans DB
    sauce.save().then(() => {
        res.status(201).json({
            message: 'Sauce correctement ajoutée !'
        });
    })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};

exports.getOneSauce = (req, res, next) => {
    // Recherche d'une sauce par son ID
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // delete sauceObject._userId;
    console.log("image modifiée = ", req.file)
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejetée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e) à modifier cette sauce !' });
                // Si l'image a été modifiée on supprime celle anciennement utilisée du dossier images
            } else if (req.file != undefined) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée, nouvelle photo active !' }))
                        .catch(error => res.status(401).json({ error }));
                })
                // Si l'image n'a pas été modifié on change uniquement les données
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée, la photo n\'a pas été changée !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejetée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e) à supprimer cette sauce !' });
            } else {
                // Suppression de l'image dans le dossier images
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllSauce = (req, res, next) => {
    // Recherche des sauces dans la collection
    Sauce.find().then(
        (Sauces) => {
            res.status(200).json(Sauces);
        })
        .catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            });
};


// Essai de like/dislike
exports.likeSauce = (req, res, next) => {
    console.log("Je suis dans le controller like")
    // Affichage du req.body
    console.log("--->Contenu req.body --Ctrl Like")
    console.log(req.body)
    // Récupéré l'id dans l'url de la requête
    console.log("--->Contenu req.params --Ctrl Like")
    console.log(req.params)
    // Mise au format de l'id pour pouvoir aller chercher l'objet correspondant dans la base de données
    console.log("--->id en _id --Ctrl Like")
    console.log({ _id: req.params.id })

    // Aller chercher l'objet dans la DB
    Sauce.findOne()
        .then((sauce) => {
            console.log("--> Contenu resultat promise : Objet --Ctrl Like", sauce);
            // Like = 1 (likes = +1)
            // Utilisation de la méthode javascript includes()
            // Utilisation de la méthode $inc (mongoDB)
            // Utilisation de la méthode $push  (mongoDB)
            // Utilisation de la méthode $pull (mongoDB)
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                console.log("--> L'utilisateur n'est pas dans usersLiked DB et execute une requete like a 1");
                // Mise à jour DB
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Like + 1" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // Like = 0 (likes = 0, sans vote)

            // Like = -1 (dislikes = +1)

            // Like = 0 (dislikes = 0, sans vote)
        })
        .catch((error) => res.status(404).json({ error }));
};


