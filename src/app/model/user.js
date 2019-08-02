const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//Primero se define el esquema
//Es como luciran los datos dentro de la DB
const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
  twitter: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
});

//Metodo que se encarga de generar una clave
//y cifrarla antes de guardar a la DB
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validatePassword = function(password) {

  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
