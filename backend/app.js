//Imporet package dotenv pour utiliser les variables d'environnement
require('dotenv').config();
//console.log(process.env); // remove this after you've confirmed it working
//importer express
const express = require('express');
//créer notre application en utilisant la méthode express ce qui permet de créer une application express
const app = express();
//Express prend toutes les requêtes qui ont comme Content-Type application/json et met à disposition leur  body  directement sur l'objet req
app.use(express.json());

//Ajout mongoose, le package Mongoose facilite les interactions entre notre application Express et notre base de données MongoDB.
const mongoose = require('mongoose');

//Connexion de l'API à notre base de données
mongoose.connect(`mongodb+srv://${process.env.BD_USERNAME}:${process.env.BD_SECRET_KEY}@${process.env.BD_CLUSTER_NAME}.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

    
//Ajout des headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Exporter cette constante pour pouvoir y accéder depuis les autres fichiers notamment notre serveur node 
module.exports = app;