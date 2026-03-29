const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // Path to models/index.js is correct if this file is in backend/src/services
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET environment variable is not set. Using a fallback secret key. This is not secure for production.');
  // In a real application, you might throw an error or implement a more robust fallback strategy
}

const registerUser = async (username, email, password) => {
  // Enhanced Validation
  if (!username || !email || !password) {
    throw new Error('All fields (username, email, password) are required.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  // Basic email format check (can be further enhanced with regex or libraries)
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error('Invalid email format.');
  }

  // Check if email already exists
  const existingUserByEmail = await User.findOne({ where: { email } });
  if (existingUserByEmail) {
    throw new Error('Email already in use.');
  }

  // Check if username already exists
  const existingUserByUsername = await User.findOne({ where: { username } });
  if (existingUserByUsername) {
    throw new Error('Username already in use.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user in DB
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, email: newUser.email },
    JWT_SECRET || 'fallback_secret_key_for_development_only',
    { expiresIn: '1h' }
  );

  return { user: newUser, token };
};

const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials.'); // Generic error for security
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials.'); // Generic error for security
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET || 'fallback_secret_key_for_development_only',
    { expiresIn: '1h' }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
