//Importer multer
const multer = require('multer');
//Dictionnaire d'extentions MIME_TYPES 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Créer un objet de configuration pour multer"storage", et utiliser la fonction diskStorage de multer pour lui dire qu'on va le stocker sur le disque, l'objet de configuration a besoin de 2 éléments distination et filename 
const storage = multer.diskStorage({
  //distination: une fonction qui va expliquer à multer dans quel dossier enregister les fichiers 
  destination: (req, file, callback) => {
    callback(null, 'images'); //null pour dire qu'il n ya pas d'erreur, nom de dossier en deuxiéme argument
  },
  //filename: pour dire à multer quel nom de fichier utilisé, car si on utilise le nom d'origine on risque d'avoir deux fichiers avec le meme nom par exemple
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');//Genérer le nouveau nom et éliminer les espace grace à split et les remplacer par des underscore grace à la methode join
    const extension = MIME_TYPES[file.mimetype]; //Utiliser les mime-types pour générer l'extention des images car on a pas accés au extention des fichiers envoyé
    //appel du fichier par son nom complet: name + timestamp +'.' +extension du fichier
    callback(null, name + Date.now() + '.' + extension);//Appeler le callback pour crée le nom au complet 
  }
});
//exporter le middleware multer configuré en passant l'objet storage
module.exports = multer({ storage: storage }).single('image');//single pour dire qu'il s'agit d'un fichier unique et pas un ensemble de fichiers