// helper function to see if email already registered.
const getUserByEmail = (email, db) => {
  for (let key in db) {
    if (db[key]["email"] === email) {
      return true;
    }
  }
  return undefined;
};

module.exports = { getUserByEmail };

