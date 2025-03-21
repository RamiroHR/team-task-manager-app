const express = require('express');
const taskRoutes = require('./routes/tasks');

// Setup API using router endpoints
const app = express();
app.use(express.json());
app.use('/api', taskRoutes);

// Setup server
const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

 // Export app and server for testing
module.exports = { app, server};
