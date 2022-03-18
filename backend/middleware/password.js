//Importer package password-validator
const passwordValidator = require('password-validator');

// Création du schéma
const schema = new passwordValidator();

//Le schéma que doit respecter le mot de passe
schema
.is().min(8) // Minimum length 8
.is().max(50) // Maximum length 50
.has().uppercase() // Must have uppercase letters
.has().lowercase()  // Must have lowercase letters
.has().digits(2)  // Must have at least 2 digits
.has().not().spaces() // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

//Vérification de la qualité du password
module.exports = (req, res, next) =>{
if(schema.validate(req.body.password)){
 next();
}else{
return res.status(400).json({error:"Le mot de passe n'est pas assez fort " + schema.validate('req.body.password', { list: true }) })
}
};

