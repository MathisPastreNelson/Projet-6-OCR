// Importation du modèle Sauce
const Sauce = require('../models/sauces');
// Importation de FS pour accéder aux fichier du serveur (les photos des sauces)
const fs = require('fs');
console.log("fs test = ", fs.link)

exports.createSauce = (req, res, next) => {
    // Les données du formulaire de création vont dans une nouvelle sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log("Sauce Crée log  : ", sauceObject);
    // console.log("1", sauceObject._id)
    // delete sauceObject._id;
    // console.log("2", sauceObject._id)
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
        .then((object) => {
            res.status(200).json(object);
            // console.log("PARAMSID : ", JSON.stringify(object.name))
            // console.log("ObjetComplet log : ", object)
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
            // Si l'userID modifiant la sauce ne correspond pas à l'userID qui a crée la sauce la reqûete est rejettée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e)' });
                // Si l'image a été modifiée on supprime l'ancienne du back
            } else if (req.file != undefined) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(401).json({ error }));
                })
            }
            // Si l'image n'a pas été modifié on change uniquement les données
            else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée mais pas photo!' }))
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
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé(e)' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
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
