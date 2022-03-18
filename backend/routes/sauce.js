//Crée un router avec la méthode router d'express
const express = require('express');
//Création du router
const router = express.Router();

//Impoter middleware auth
const auth = require('../middleware/auth');
//Importer middleware multer-config
const multer = require('../middleware/multer-config');
//Importer les controllers
const sauceCtrl = require('../controllers/sauce');

//Enregistrement des routes dans le router et application des fonctions du controllers 
// auth applique authentification à toutes les routes
// multer applique l'ajout de fichier aux routes post et put, doit être placé après auth
router.post('/', auth, multer, sauceCtrl.createSauce);//Route pour ajouter une sauce

router.get('/:id', auth, sauceCtrl.getOneSauce);//Route pour trouver une seule sauce

router.put('/:id', auth, multer, sauceCtrl.modifySauce);//Route pour mettre à jour une sauce existante

router.delete('/:id', auth, sauceCtrl.deleteSauce);//Route pour la suppression d'une sauce

router.get('/', auth, sauceCtrl.getAllSauces);//Route pour trouver toutes les sauces

router.post('/:id/like', auth, sauceCtrl.likeSauce);//Route pour liker une sauce

//Exporter le router 
module.exports = router;