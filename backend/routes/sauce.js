//crée un router avec la méthode router d'express
const express = require('express');
//création du router
const router = express.Router();

//impoter middleware auth
const auth = require('../middleware/auth');
//importer middleware multer-config
const multer = require('../middleware/multer-config');
//importer les controllers
const stuffCtrl = require('../controllers/sauce');


router.post('/', auth, multer, stuffCtrl.createSauce);

router.get('/:id', auth, stuffCtrl.getOneSauce);

router.put('/:id', auth, multer, stuffCtrl.modifySauce);


router.delete('/:id', auth, stuffCtrl.deleteSauce);

router.get('/', auth, stuffCtrl.getAllSauces);

//exporter le router 
module.exports = router;