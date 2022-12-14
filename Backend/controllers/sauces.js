// Importation du modèle Sauce
const Sauce = require('../models/sauces');
// Importation de FS pour accéder aux fichier du serveur (les photos des sauces)
const fs = require('fs');
// console.log("fs test = ", fs.link)

exports.createSauce = (req, res, next) => {
    // Les données du formulaire de création vont dans une nouvelle sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log("Sauce Crée log  : ", sauceObject)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
    // Aller chercher la sauce correspondant à l'iD de l'url dans la DB 
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
    // Verifie que req.file existe (nouvelle image), si oui on traite l'image sinon juste l'objet entrant
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        // ImageUrl représente http://localhost:3000/images/imageNom par défaut
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log("image modifiée = ", req.file)
    // Aller chercher la sauce correspondant à l'iD de l'url dans la DB 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("image modifiée = ", req.file)
            // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejetée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e) à modifier cette sauce !' });
                // Si l'image a été modifiée on supprime celle anciennement utilisée du dossier images
            } else if (req.file != undefined) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // Puis on prend en compte les données
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
    // Aller chercher la sauce correspondant à l'iD de l'url dans la DB 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejetée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e) à supprimer cette sauce !' });
            } else {
                // Suppression de l'image dans le dossier images
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // Suppression des données dans la DB
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
    // Recherche des sauces dans la collection de la DB
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

exports.likeSauce = (req, res, next) => {
    // Affichage du req.body
    console.log("-->req.body/Ctrl Like")
    console.log(req.body)
    // Mise au format de l'id pour pouvoir aller chercher l'objet correspondant dans la base de données
    console.log("-->req.params/Ctrl Like")
    console.log({ _id: req.params.id })

    // Aller chercher la sauce correspondant à l'iD de l'url dans la DB 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Utilisation de la méthode javascript includes()
            // Like = +1 si l'utilisateur n'est pas dans [usersLiked] DB et execute une requete like a 1 (ajoute un like)
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                // Mise à jour DB
                Sauce.updateOne({ _id: req.params.id },
                    {
                        // Utilisation de la méthode $inc (mongoDB)
                        $inc: { likes: 1 },
                        // Utilisation de la méthode $push  (mongoDB)
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "like de la sauce" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // Like = 0 si l'utilisateur est dans [usersLiked] DB et execute une requete like a 0 (enlève son like)
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                // Mise à jour DB
                Sauce.updateOne({ _id: req.params.id },
                    {
                        // Utilisation de la méthode $inc (mongoDB)
                        $inc: { likes: -1 },
                        // Utilisation de la méthode $pull  (mongoDB)
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "like annulé" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // disLike = +1 si l'utilisateur n'est pas dans [usersLiked] DB et execute une requete disLike a 1 (ajoute un disLike)
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                // Mise à jour DB
                Sauce.updateOne({ _id: req.params.id },
                    {
                        // Utilisation de la méthode $inc (mongoDB)
                        $inc: { dislikes: 1 },
                        // Utilisation de la méthode $push  (mongoDB)
                        $push: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "dislike de la sauce" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // disLike = 0 si l'utilisateur est dans [usersLiked] DB et execute une requete disLike a 0 (enlève son disLike)
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                // Mise à jour DB
                Sauce.updateOne({ _id: req.params.id },
                    {
                        // Utilisation de la méthode $inc (mongoDB)
                        $inc: { dislikes: -1 },
                        // Utilisation de la méthode $pull  (mongoDB)
                        $pull: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "dislike annulé" }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
};


