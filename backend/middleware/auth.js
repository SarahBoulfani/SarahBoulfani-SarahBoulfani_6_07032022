//Importer le package jsonwebtoken pour verifier le token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//récupérer le token dans le header autorisation, nous utilisons la fonction split pour récupérer tout après l'espace dans le header qui va retourner Bearer en premier element et le token en deuxiéme élément donc l'index 1 pour retourné le token car Bearer a l'index 0. donc ici soit on a le header qui existe pas ou split retourne errur siya erreur elle va l'aaficher dans catch 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
    const userId = decodedToken.userId;//nous extrayons l'ID utilisateur de notre token car apres décodage le token devient un objet javascript classique donc on peut récupérer le user id qui est dedans .

    if (req.body.userId && req.body.userId !== userId) {//si la demande contient un ID utilisateur dans le body de la requete, nous le comparons ce contenu à celui extrait du token donc userId. S'ils sont différents, nous générons une erreur 
      throw 'User ID non valable'; //throw pour renvoyer l'erreur dans catch
    } else {//sinon si tout va bien on appelle next
      next();//Si tout fonctionne, et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() donc au fonctions quil ya dans controllers c'est pour ça il faut importer auth avant controllers dans le fichier stuff de routes 
    }
  } catch (error) {
    //erreur 401 erreur authentification
    res.status(401).json({ error: error | 'Requête non authentifiée!' });
  }
};