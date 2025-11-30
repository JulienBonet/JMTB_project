/* eslint-disable no-restricted-syntax */

const bcrypt = require("bcrypt");

const password = "Elliot2006!";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hashed) => {
  if (err) throw err;
  console.log("Mot de passe hashé :", hashed);
});

//------------------------------------
// cmd :
// node backend/scripts/createAdmin.js
//-------------------------------------
