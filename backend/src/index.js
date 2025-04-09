const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const taskRoutes = require('./routes/tasks.js');


// Setup API
const app = express();
app.use(cors({
  origin: ['https://task-manager-gz1ufnupu-ramiros-projects-3a362cea.vercel.app', 'http://localhost:5173'],
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
