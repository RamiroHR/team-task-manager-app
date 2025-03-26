const express = require('express');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');


// Setup API
const app = express();
app.use(express.json());

//Set up routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// Setup server
const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

 // Export app and server for testing
module.exports = { app, server};
