const bcrypt = require("bcryptjs");

const getUserByEmail = (email, db) => {
  for(let key in db) {
    if (db[key]["email"] === email) {
    return true
    }
  }
  return false;
};

module.exports = { getUserByEmail };

