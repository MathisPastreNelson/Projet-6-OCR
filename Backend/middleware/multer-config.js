const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now()
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // Création du filename + timestamp + . + extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});
// console.log(extension)

// Exportation du middleware MULTER, on lui passe l'objet stocké, la méthode single() car c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage: storage }).single('image');