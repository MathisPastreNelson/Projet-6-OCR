// Importation du modèle Sauce
const Sauce = require('../models/sauces');

exports.createSauce = (req, res, next) => {
    // Les données du formulaire de création vont dans une nouvelle sauce
    console.log("Non Parsé", req.body)
    const sauceObject = JSON.parse(req.body);
    console.log("Parsed", sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Je sauvegarde la nouvelle sauce dans DB
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce correctement ajoutée !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    // Recherche d'une sauce par son ID
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce mise à jour !!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: 'Sauce supprimée !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getAllSauce = (req, res, next) => {
    // Recherche des sauces dans la collection
    Sauce.find().then(
        (Sauces) => {
            res.status(200).json(Sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
