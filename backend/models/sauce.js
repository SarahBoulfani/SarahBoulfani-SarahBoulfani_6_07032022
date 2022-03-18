//Importer mongoose
const mongoose = require('mongoose');

//Crée notre schéma
//Nous créons un schéma de données qui contient les champs souhaités pour chaque sauce, indique leur type ainsi que leur caractère (obligatoire ou non). Pour cela, on utilise la méthode Schema mise à disposition par Mongoose.
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] },
});
//Nous exportons ce schéma en tant que modèle Mongoose appelé Sauce, le rendant par là même disponible pour notre application Express.
//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model('Sauce', sauceSchema);