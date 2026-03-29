const express = require('express');
const cors = require('cors'); // For handling cross-origin requests
const authRoutes = require('./src/routes/authRoutes');
// Import other routes/middleware as needed later

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware
app.use(cors()); // Enable CORS for all origins, will be configured more strictly later
app.use(express.json()); // Parse incoming JSON requests

// Mount routes
app.use('/api/auth', authRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('Welcome to the Chat API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export app for testing
