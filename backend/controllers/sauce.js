//Importer le model sauce
const Sauce = require('../models/sauce');
//importer package fs de node fs:file system qui nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

//POST
//ci, vous créez une instance de votre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
exports.createSauce = (req, res, next) => {
  //Transformer la chaîne de caractère en objet
  const sauceObject = JSON.parse(req.body.sauce);
  //supprimer l'id généré automatiquement
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,//L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de sauceObject
    //génèrer l'url de l'image: http /https + nom d'hôte + images + nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save() //Ce modèle comporte une méthode save() qui enregistre simplement votre Sauce dans la base de données.
    //La méthode save() renvoie une Promise. Ainsi, dans notre bloc then() , nous renverrons une réponse de réussite avec un code 201 de réussite. Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))//il faut envoyer une réponse sinon la requete plantera coté user
    .catch(error => res.status(400).json({ error }));
};


//Get trouvé un seul élément
exports.getOneSauce = (req, res, next) => { //nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre 
  Sauce.findOne({ _id: req.params.id })//nous utilisons ensuite la méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête
    .then(sauce => res.status(200).json(sauce))//cette Sauce est ensuite retourné dans une Promise et envoyé au front-end 
    .catch(error => res.status(404).json({ error }));//si aucune sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
};

//PUT mettez à jour un sauce existant
//Ci-dessous, nous exploitons la méthode updateOne() dans notre modèle sauce . Cela nous permet de mettre à jour le sauce qui correspond à l'objet que nous passons comme premier argument. Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le sauce passé comme second argument

exports.modifySauce = (req, res, next) => {
  //Opérateur terniaire pour vérifier s'il existe un fichier image ou non
  const sauceObject = req.file ?
    {//si il y a un fichier on récupère la chaîne de caractère et on la parse en objet javascript
      ...JSON.parse(req.body.sauce),
      //on modifie imageUrl sinon on prend simplement les information req.body
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //req.body si le fichier n'existe pas 
    //on utilise le paramètre id de la requête pour trouver la sauce et la modifier avec le même _id
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Suppression d'une sauce
//La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() dans le sens où nous lui passons un objet correspondant au document à supprimer. Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
exports.deleteSauce = (req, res, next) => {
   //récupérer sauce de la base de données
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //extraire le nom de fichier à supprimer
      const filename = sauce.imageUrl.split('/images/')[1];
      //avec le nom de fichier et grace à la fonction unlink du package fs on supprimer le fichier
      fs.unlink(`images/${filename}`, () => {
        //une fois la suppresion du fichier est effectuer on supprime l'objet dans la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));//erreur serveur
};

//recupérer toutes les sauces   

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};
//les likes
exports.likeSauce = (req, res, next)=>{
  //Nous avons 3 cas possible
  //like = 1 (likes = +1)
  //like = 0 (likes = 0)
  //like = -1 (dislikes = +1)
  //like = 0 (dislikes = 0)
  //récupérer l'id dans l'url de la requete
  
  /*Récupérer l'objet de la base de données */
 Sauce.findOne({_id: req.params.id})
 .then((sauceObject) => {
   
   
   //utilisation de la méthode javascript includes
   //La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
   //utilisation de l'opérateur $inc (mongoDB)
   //utilisation de l'opérateur $push (mongoDB)
   //utilisation de l'opérateur $pull (mongoDB)
   //si userliked est false et si like===1 alors on met le like à +1 et le user dans le tableau userLiked
   if(!sauceObject.usersLiked.includes(req.body.userId) && req.body.like === 1){
      //mise à jour base de données
      Sauce.updateOne({_id: req.params.id},
        {
          $inc :{likes : 1}
        }
        )
        .then()
        .catch();
   }

 })
 .catch((error) => res.status(404).json({error}));
};