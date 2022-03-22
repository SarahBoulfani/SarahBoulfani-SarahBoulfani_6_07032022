//Importer mongoose
const mongoose = require('mongoose');
//Importer le pluguin mongoose-unique-validator pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
const uniqueValidator = require('mongoose-unique-validator');

//Créer notre schema user on utilisant la fonction schema de mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Appliquer le validateur au schéma en appelant la méthode plugin avant d'en faire un modéle
userSchema.plugin(uniqueValidator);


//Exporter le schema sous forme de modéle 
module.exports = mongoose.model('User', userSchema);