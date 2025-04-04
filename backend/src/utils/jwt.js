const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET; // Use the secret key from environment variables

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);   //This hashes password with salt (10 rounds)
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);     //bcrypt manage the passwrod salting comparison.
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
