//Importer le model sauce
const Sauce = require('../models/sauce');
//Importer package fs de node fs:file system qui nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

//Ajouter une sauce 
exports.createSauce = (req, res, next) => {
  //Transformer la chaîne de caractère en objet
  const sauceObject = JSON.parse(req.body.sauce);
  //Supprimer l'id généré automatiquement
  delete sauceObject._id;
  //Créer une instance de notre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de la requête
  const sauce = new Sauce({
    ...sauceObject,//L'opérateur spread est utilisé pour faire une copie de tous les éléments de sauceObject
    //Génèrer l'url de l'image: http /https + nom d'hôte + images + nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save() //Enregistrer notre Sauce dans la base de données grace à save().
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))//Création d'une sauce
    .catch(error => res.status(400).json({ error }));
};

//Récupérer une seule sauce
exports.getOneSauce = (req, res, next) => { //nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre 
  Sauce.findOne({ _id: req.params.id })//nous utilisons ensuite la méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête
    .then(sauce => res.status(200).json(sauce))//cette Sauce est ensuite retourné dans une Promise et envoyé au front-end 
    .catch(error => res.status(404).json({ error }));//si aucune sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
};

//Modifier une sauce existante
exports.modifySauce = (req, res, next) => {
  //Opérateur terniaire pour vérifier s'il existe un fichier image ou non
  const sauceObject = req.file ?
    {//si il y a un fichier on récupère la chaîne de caractère et on la parse en objet javascript
      ...JSON.parse(req.body.sauce),
      //on modifie imageUrl sinon on prend simplement les information req.body
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //req.body si le fichier n'existe pas 
  //On utilise le paramètre id de la requête pour trouver la sauce et la modifier avec le même _id grace à la méthode updateOne(). Cela nous permet de mettre à jour le sauce
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  //Récupérer sauce de la base de données
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //Extraire le nom de fichier à supprimer
      const filename = sauce.imageUrl.split('/images/')[1];
      //Avec le nom de fichier et grace à la fonction unlink du package fs on supprimer le fichier
      fs.unlink(`images/${filename}`, () => {
        //Une fois la suppresion du fichier est effectué on supprime l'objet dans la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));//erreur serveur
};

//Recupérer toutes les sauces   
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//les likes
exports.likeSauce = (req, res, next) => {
  //Nous avons 4 cas possible
  //(1)--like = 1 (likes = +1)
  //récupérer l'id dans l'url de la requete (_id: req.params.id)
  //Récupérer l'objet de la base de données 
  Sauce.findOne({ _id: req.params.id })
    .then((sauceObject) => {
      //utilisation de la méthode javascript includes
      //La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
      //utilisation de l'opérateur $inc (mongoDB)
      //utilisation de l'opérateur $push (mongoDB)
      //utilisation de l'opérateur $pull (mongoDB)

      //si userliked est false et si like===1 alors on met le like à +1 et le user dans le tableau userLiked
      if (!sauceObject.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        //Mise à jour de la base de données
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { likes: 1 }, //Incrémenter de 1
            $push: { usersLiked: req.body.userId }//Ajouter le userId dans le tableau usersLiked pour qu'il puisse plus liké
          }
        )
          .then(() => res.status(201).json({ message: "Like ajouté !" }))
          .catch((error) => res.status(400).json({ error }));//bad request
      }
      //(2)--like = 0 (likes = 0)
      if (sauceObject.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        //Mise à jour de la base de données
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId }//Supprimer le userId dans le tableau usersLiked grace à la methode pull
          }
        )
          .then(() => res.status(201).json({ message: "Like supprimé !" }))
          .catch((error) => res.status(400).json({ error }));//bad request
      }
      //(3)--like = -1 (dislikes = +1)
      if (!sauceObject.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        //Mise à jour de la base de données
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { dislikes: 1 }, //Incrémenter de 1
            $push: { usersDisliked: req.body.userId }//Ajouter le userId dans le tableau usersDisliked 
          }
        )
          .then(() => res.status(201).json({ message: "Dislike ajouté !" }))
          .catch((error) => res.status(400).json({ error }));//bad request
      }
      //(4)--Aprés un like -1 on met un like = 0 et on enléve le dislike (dislikes = 0)
      if (sauceObject.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        //Mise à jour de la base de données
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId }//Supprimer le userId dans le tableau usersDisliked grace à la methode pull
          }
        )
          .then(() => res.status(201).json({ message: "Dislike supprimé !" }))
          .catch((error) => res.status(400).json({ error }));//bad request
      }


    })
    .catch((error) => res.status(404).json({ error }));//Objet non trouvable
};