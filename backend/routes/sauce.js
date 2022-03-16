//crée un router avec la méthode router d'express
const express = require('express');
//création du router
const router = express.Router();

//impoter middleware auth
const auth = require('../middleware/auth');
//importer middleware multer-config
const multer = require('../middleware/multer-config');
//importer les controllers
const sauceCtrl = require('../controllers/sauce');


router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);


router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
//router pour les likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);


//exporter le router 
module.exports = router;