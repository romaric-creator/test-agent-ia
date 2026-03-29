const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Use 400 for validation/business logic errors
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: 'User logged in successfully', user, token });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Use 400 for validation/business logic errors
  }
};
