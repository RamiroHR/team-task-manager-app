const express = require('express');

const authRoutes = require('./routes/auth.js');
const taskRoutes = require('./routes/tasks.js');


// Setup API
const app = express();
app.use(express.json());


//Set up routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);


// Server startup logic
let server;
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`));
}


// Always export app, conditionally export server
module.exports = process.env.NODE_ENV === 'production'
  ? { app }
  : { app, server };
