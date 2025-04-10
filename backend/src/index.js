const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.js');
const taskRoutes = require('./routes/tasks.js');

// Load environment variables - prioritize test config if in test environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './.env.test' });
} else {
  dotenv.config();
}


// Setup API
const app = express();


// Prevent CORS issues
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());


//Set up routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);


// Server startup logic
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app and server
module.exports = { app, server };
