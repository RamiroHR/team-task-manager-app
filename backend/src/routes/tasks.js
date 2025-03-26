const express = require('express');
const { PrismaClient } = require('@prisma/client');

const authenticate = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

// Apply the authenticate middleware to protect all task routes
router.use(authenticate);

// GET TOP N MOST RECENT TASKS
router.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return res.json(tasks);
});


// GET RECENT TASKS in PAGE p
router.get('/tasks/page/:p', async (req, res) => {
  const { p } = req.params;

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc'},
    skip: (p-1)*10,
    take: 10
  });

  return res.json(tasks);
});


// GET A TASK BY id
router.get('/task/:id', async (req, res) => {
  const { id } = req.params;

  const retrievedTask = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  return res.json(retrievedTask)
})


// DELETE A TASK BY id
router.delete('/task/delete/:id', async (req, res) => {
  const { id } = req.params;

  const deletedTask = await prisma.task.delete({
    where: { id: Number(id) },
  });

  return res.json(deletedTask)
})


// ADD A NEW TASK
router.post('/task/new', async (req, res) => {
  const { title } = req.body;

  const newTask = await prisma.task.create({
    data: { title, }
  });

  return res.json(newTask)
})


// EDIT A TASK BY id
router.put('/task/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updatedTask = await prisma.task.update({
    where: {id: Number(id) },
    data: { title, completed },
  });

  return res.json(updatedTask)
})


module.exports = router;
