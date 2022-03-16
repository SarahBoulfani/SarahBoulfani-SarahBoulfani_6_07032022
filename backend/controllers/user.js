//Importer le package bcrypte
const bcrypt = require('bcrypt');
//Importer le package jsonwebtoken
const jwt = require('jsonwebtoken');

//Importer le model user
const User = require('../models/user');


//on aura besoin  de deux middleware donc deux fonctions
//_________________________________________________________________________
//fonction qui permet aux utilisateurs de s'inscrir et les enregister dans la base de données avec leur mails et le hash de leur mot de passe (Enregister un nouveau utilisateur )
 exports.signup = (req, res, next) => {
    //une fonction hash de bcrypt asynchrone donc qui prend du temps, qui va hasher le mot de passe en suite on enregistre le user dans la BDD
    bcrypt.hash(req.body.password, 10) //req.body.password est le mot de passe du corps de la requete passer par le frontend, le 10 donc 10 tour: c'est combien de fois on exécute l'algorithme de hashage de mot de passe. 10 est suffisant pour sécuriser le mot de passe
    .then(hash => { //on récupére le hash de mot de passe qu'on va enregistrer sans un nouveau user quon va ebregistrer dans la base de données
      const user = new User({
        email: req.body.email,
        password: hash //donc le mot de passe crypté à fin de ne pas stocker le mot de passe en blanc
      });
      user.save() //enregistrer user dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))//201 création de ressource
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));//500 erreur serveur

}; 
//________________________________________________
//une fonction pour verifier les identifiants d'un utilisateur en comparant le hash de mot de passe entré avec le hash enregistré dans la base de données (connecter des utilisateurs existants)

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //trouver l'utilisateur pour qui le mail dans la base de données correspond à l'adresse mail envoyé dans le body de la reqete 
    .then(user => {
      if (!user) { //si on récupére pas un user on envoie un msg d"erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) //si on arrive ici c'est qu'on a bien trouvé un user et donc on va utilisé la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .then(valid => {
          if (!valid) { //si on reçois false c'est que l'utilisateur a rentré le mauvais mot de passe on retourne une erreur
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({// comparaison retourne true et donc  identifiant valable on renvoie
            userId: user._id, //identifiant de l'utilisateur dans la base de données
            token: jwt.sign( //sign prend 3 arguments ({les données qu'on veut encoder(payload) donc userId},{clé secréte pour l'encodage}, {configurer une expiration de notre token})
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


