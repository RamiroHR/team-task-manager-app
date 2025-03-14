const express = require('express');
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Temporary simple GET endopint to test express server
app.get('/api/tasks_hardcoded', (req, res) => {

  // hard coded list of example tasks
  const tasks = [
    {id: 1, title: 'Setup git repository', completed: true},
    {id: 2, title: 'Install git flow', completed: true},
    {id: 3, title: 'Build basic backend', completed: true},
    {id: 4, title: 'Build basic frontend', completed: true},
    {id: 5, title: 'Test integration', completed: true},
    {id: 6, title: 'Build basic frontend', completed: true},
    {id: 7, title: 'Expand features and Functionalities', completed: false},
  ];

  //return list of task
  res.json(tasks);
});


app.get('/api/tasks_db', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});
