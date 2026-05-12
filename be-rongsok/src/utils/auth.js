const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '24h'
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword
};
