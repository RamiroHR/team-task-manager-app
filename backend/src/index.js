import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import express from 'express'
const app = express();
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


// GET ALL TASKS
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});


// GET A TASK BY id
app.get('/api/task/:id', async (req, res) => {
  const { id } = req.params;

  const retrievedTask = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  res.json(retrievedTask)
})


// DELETE A TASK BY id
app.delete('/api/task/delete/:id', async (req, res) => {
  const { id } = req.params;

  const deletedTask = await prisma.task.delete({
    where: { id: Number(id) },
  });

  res.json(deletedTask)
})


// ADD A NEW TASK
app.post('/api/task/new', async (req, res) => {
  const { title } = req.body;

  const newTask = await prisma.task.create({
    data: { title, }
  });

  res.json(newTask)
})


// EDIT A TASK BY id
app.put('/api/task/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updatedTask = await prisma.task.update({
    where: {id: Number(id) },
    data: { title, completed },
  });

  res.json(updatedTask)
})
