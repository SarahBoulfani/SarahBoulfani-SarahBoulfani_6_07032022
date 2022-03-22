//Importer package dotenv pour utiliser les variables d'environnement
require('dotenv').config();
//console.log(process.env); // remove this after you've confirmed it working

//Importer express
const express = require('express');

//Importer helmet
const helmet = require("helmet");

//Importer path qui donne accés au chemin de notre systeme de fichiers
const path = require('path');

//Créer notre application en utilisant la méthode express ce qui permet de créer une application express
const app = express();

//Utiliser express.json pour prendre toutes les requêtes qui ont comme Content-Type application/json et mettre à disposition leur body directement sur l'objet req
app.use(express.json());

//Utilisation de 'helmet' sur l'application 'express' 
app.use(helmet({crossOriginResourcePolicy: false}));

//Importer le router user
const userRoutes = require('./routes/user');
//Importer le router sauce
const saucesRoutes = require('./routes/sauce');

//Ajout mongoose, le package Mongoose facilite les interactions entre notre application Express et notre base de données MongoDB.
const mongoose = require('mongoose');


//Connexion de l'API à notre base de données mongoDB
mongoose.connect(`mongodb+srv://${process.env.BD_USERNAME}:${process.env.BD_SECRET_KEY}@${process.env.BD_CLUSTER_NAME}.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Ajout des headers pour accéder à notre API depuis n'importe quelle origine et avec les méthodes mentionnées. Le middleware ne prend pas d'adresse afin de s'appliquer à toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Gérer la route vers le dossier images et traiter les requêtes vers la route /image. express.static gère de manière statique la ressource images à chaque requête vers la route images.
app.use('/images', express.static(path.join(__dirname, 'images')));
//Enregister le router user
app.use('/api/auth', userRoutes);
//Enregistrer notre routeur pour toutes les demandes effectuées vers /api/sauces
app.use('/api/sauces', saucesRoutes);

//Exporter cette constante pour pouvoir y accéder depuis les autres fichiers notamment notre serveur node 
module.exports = app;