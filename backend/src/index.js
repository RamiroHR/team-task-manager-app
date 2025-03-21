// import { PrismaClient } from '@prisma/client'
// import express from 'express'
const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient()

const app = express();
app.use(express.json());

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


// GET TOP N MOST RECENT TASKS
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc'},
    take: 10
  });
  res.json(tasks);
});

// GET RECENT TASKS in PAGE p
app.get('/api/tasks/page/:p', async (req, res) => {
  const { p } = req.params;

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc'},
    skip: (p-1)*10,
    take: 10
  });
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


module.exports = { app, server}; // Export app and server for testing
