//Importer multer
const multer = require('multer');
//Dictionnaire MIME_TYPES 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Crée un objet de configuration pour multer"storage", utiliser la fonction diskStorage de multer pour lui dire qu'on va le stocker sur le disk l'objet de configuration a besoin de 2 éléments distination: une fonction qui va expliquer à multer dans quel dossier enregister les fichiers et filename: pour dire à multer quel nom de fichier utilisé, car si on utilise le nom d'origine on risque d'avoir deux fichiers avec le mme nom par exemple
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); //null pour dire qu'il n ya pas d'erreur, nom de dossier en deuxiéme argument
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');//genérer le nouveau nom et éliminer les espace grace à split et les remplacer par des underscore grace à la methode join
    const extension = MIME_TYPES[file.mimetype]; //utiliser les mime-types pour générer l'extention des images car on a pas accés au extention des fichiers envoyé
    //appel du fichier par son nom complet: name + timestamp +'.' +extension du fichier
    callback(null, name + Date.now() + '.' + extension);//appeler le callback pour crée le nom au complet 
  }
});
