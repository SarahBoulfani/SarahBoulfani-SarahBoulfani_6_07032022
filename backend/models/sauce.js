//Importer mongoose
const mongoose = require('mongoose');
//crée notre schéma
//nous créons un schéma de données qui contient les champs souhaités pour chaque sauce, indique leur type ainsi que leur caractère (obligatoire ou non). Pour cela, on utilise la méthode Schema mise à disposition par Mongoose.
//La méthode  Schema  de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB.
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    usersLiked: { type: Array, default: []},
    usersDisliked: { type: Array, default: []},
});
//ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « sauce », le rendant par là même disponible pour notre application Express.
//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model('Sauce', sauceSchema);