/* eslint-disable consistent-return */
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findByName,
  createUser,
  updatePassword,
  deleteUserById,
} = require("../models/userModel");

// LOGIN
const login = async (req, res) => {
  const { name, password } = req.body;

  const [rows] = await findByName(name);
  const user = rows[0];

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // IMPORTANT : on utilise user.password_hash
  if (!user.password_hash)
    return res.status(400).json({ error: "User has no password set" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, name: user.name, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token });
};

// REGISTER (Admin only)
const register = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ error: "Only admin can create users" });

  const { name, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Assure-toi que createUser insère bien dans password_hash
  await createUser(name, hashedPassword, isAdmin);

  return res.status(201).json({ message: "User created" });
};

// CHANGE PASSWORD (Admin only)
const changePassword = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ error: "Only admin can change passwords" });

  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  // Assure-toi que updatePassword met à jour password_hash
  await updatePassword(req.params.id, hashed);

  return res.json({ message: "Password updated" });
};

// DELETE USER (Admin only)
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await deleteUserById(userId);
  res.json({ message: "User deleted" });
};

module.exports = {
  login,
  register,
  changePassword,
  deleteUser,
};
