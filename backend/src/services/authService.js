const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // Adjust path if models are in a different structure
const saltRounds = 10; // Number of salt rounds for bcrypt

const registerUser = async (username, email, password) => {
  // Basic validation (can be enhanced)
  if (!username || !email || !password) {
    throw new Error('Missing required fields for registration');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
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
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only', // Use environment variable in production
    { expiresIn: '1h' }
  );

  return { user: newUser, token };
};

const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only', // Use environment variable in production
    { expiresIn: '1h' }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
