const bcrypt = require("bcryptjs");

// Demo student. The password is stored as a hash, never as plain text.
const users = [
  {
    id: 1,
    name: "Demo Student",
    email: "student@campusconnect.test",
    passwordHash: bcrypt.hashSync("Campus26", 10),
  },
];

function findByEmail(email) {
  const clean = String(email || "").trim().toLowerCase();
  return users.find((user) => user.email === clean);
}

function findById(id) {
  return users.find((user) => user.id === id);
}

module.exports = { findByEmail, findById };