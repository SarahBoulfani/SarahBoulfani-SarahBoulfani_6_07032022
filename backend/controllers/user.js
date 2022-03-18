//Importer le package bcrypte
const bcrypt = require('bcrypt');
//Importer le package jsonwebtoken
const jwt = require('jsonwebtoken');

//Importer le model user
const User = require('../models/user');


//Middleware avec une fonction qui permet aux utilisateurs de s'inscrir et les enregister dans la base de données avec leur mails et le hash de leur mot de passe (Enregister un nouveau utilisateur )
exports.signup = (req, res, next) => {
  //une fonction hash de bcrypt qui va hasher le mot de passe 
  bcrypt.hash(req.body.password, 10)
    .then(hash => { //On récupére le hash de mot de passe qu'on va enregistrer dans un nouveau user puis l'enregistrer dans la base de données
      const user = new User({
        email: req.body.email,
        password: hash //Le mot de passe crypté à fin de ne pas stocker le mot de passe en blanc
      });
      user.save() //Enregistrer user dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))//201 création de ressource
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));//500 erreur serveur

};

//middleware avec une fonction pour verifier les identifiants d'un utilisateur en comparant le hash de mot de passe entré avec le hash enregistré dans la base de données (connecter des utilisateurs existants)
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //Trouver l'utilisateur pour qui le mail dans la base de données correspond à l'adresse mail envoyé dans le body de la reqete 
    .then(user => {
      if (!user) { //si on récupére pas un user on envoie un msg d"erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) //Si on arrive ici c'est qu'on a bien trouvé un user et donc on va utilisé la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .then(valid => {
          if (!valid) { //si on reçois false c'est que l'utilisateur a rentré le mauvais mot de passe on retourne une erreur
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({// comparaison retourne true et donc identifiant valable
            userId: user._id, //identifiant de l'utilisateur dans la base de données
            token: jwt.sign( //on verifier le token à chaque fois avec la fonction sign qui prend 3 arguments ({les données qu'on veut encoder(payload)},{clé secréte pour l'encodage}, {configurer une expiration de notre token})
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


