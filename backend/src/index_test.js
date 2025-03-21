const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

// GET TOP N MOST RECENT TASKS
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc' },
    take: 10,
  });
  res.json(tasks);
});

module.exports = { app, server, prisma }; // Export app, server, and prisma for testing

