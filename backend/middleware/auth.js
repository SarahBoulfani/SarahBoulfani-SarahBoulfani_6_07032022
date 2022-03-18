//Importer le package jsonwebtoken pour verifier le token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//Récupérer le token dans le header autorisation, nous utilisons la fonction split pour récupérer tout après l'espace dans le header qui va retourner Bearer en premier élément et le token en deuxiéme élément
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Utiliser la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
    const userId = decodedToken.userId;//Puis nous extrayons l'ID utilisateur de notre token car aprés décodage le token devient un objet javascript classique donc on peut récupérer le userId qui est dedans
    req.auth = { userId: userId };//Ajouter le userId à l'objet req pour s'en servir pour la comparaison avec le userId de la sauce qu'on essaie de supprimer, car dans controllers delete on a pas accés au userId
    if (req.body.userId && req.body.userId !== userId) {//Si la demande contient un ID utilisateur dans le body de la requete, nous comparons ce contenu à celui extrait du token donc userId. S'ils sont différents, nous générons une erreur 
      throw 'User ID non valable'; //throw pour renvoyer l'erreur dans catch
    } else {//sinon si tout va bien on appelle next
      next();//Si tout fonctionne, et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() donc au fonctions qu'il ya dans controllers
    }
  } catch (error) {
    //Erreur 401 erreur authentification
    res.status(401).json({ error: error | 'Requête non authentifiée!' });
  }
};


