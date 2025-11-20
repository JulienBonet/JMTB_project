const db = require("../../database/client");

const createUser = (name, hashedPassword, isAdmin) => {
  return db.query(
    "INSERT INTO user (name, password_hash, isAdmin) VALUES (?, ?, ?)",
    [name, hashedPassword, isAdmin]
  );
};

const updatePassword = (id, hashedPassword) => {
  return db.query("UPDATE user SET password_hash = ? WHERE id = ?", [
    hashedPassword,
    id,
  ]);
};

const deleteUserById = (id) => {
  return db.query("DELETE FROM user WHERE id = ?", [id]);
};

const findByName = (name) => {
  return db.query("SELECT * FROM user WHERE name = ?", [name]);
};

module.exports = { createUser, updatePassword, deleteUserById, findByName };
