const express = require('express');
const app = express();

app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));

// Temporary simple GET endopint to test express server
app.get('/api/tasks', (req, res) => {

  // hard coded list of example tasks
  const tasks = [
    {id: 1, title: 'Setup git repository', completed: true},
    {id: 2, title: 'Install git flow', completed: true},
    {id: 3, title: 'Build basic frontend', completed: false},
    {id: 4, title: 'Build basic frontend', completed: false},
  ];

  //return list of task
  res.json(tasks);
});
