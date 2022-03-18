//Importer express
const express = require('express');
//Créer le router avec la méthode router d'express
const router = express.Router();
//Importer le middleware password
const password = require('../middleware/password');
//Importer le controllers
const userCtrl = require('../controllers/user');
//Créer les routes
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);
//exporter les routes 
module.exports = router;