const express = require('express');
const { PrismaClient } = require('@prisma/client');

const authenticate = require('../middleware/authMiddleware.js');
const { taskSchema } = require('../validator/schemas.js');

const prisma = new PrismaClient();
const router = express.Router();

// Apply the authenticate middleware to protect all task routes
router.use(authenticate);


// ADD A NEW TASK
router.post('/task/new', async (req, res) => {

  try {
    // validation
    const {error, value} = taskSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: 'Validation error.'
      });
    }

    // proceed if validation passes
    const { title, description } = value

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
      }
    });

    return res.status(200).json(newTask);

  } catch (error) {
    console.error('error creating task:', error);
    return req.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create task'
    })

  }

})


// GET TOP N MOST RECENT TASKS
router.get('/tasks', async (req, res) => {

  const N = 100;

  try {
    const tasks = await prisma.task.findMany({
      where: { discarded: false},
      orderBy: { createdAt: 'asc' },
      take: N,
    });
    return res.json(tasks);

  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({
      error: 'Internal server Error',
      message: 'Failed to tefch tasks'
    });
  }
});


// GET RECENT TASKS in PAGE p
router.get('/tasks/page/:p', async (req, res) => {
  const { p } = req.params;
  const pageSize = 10;

  try {
    const tasks = await prisma.task.findMany({
      where: { discarded: false},
      orderBy: { createdAt: 'asc'},
      skip: (p-1)*pageSize,
      take: pageSize
    });
    return res.json(tasks);

  } catch (err) {
    console.error(`Error fetching page ${p}`, err);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch page'
    })
  }
});


// GET A TASK BY id
router.get('/task/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const retrievedTask = await prisma.task.findUnique({
      where: {
        id: Number(id),
        discarded: false
       },
    });

    if (!retrievedTask) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      })
    }

    return res.status(200).json(retrievedTask)

  } catch (err) {
    console.error(`Error fetching task:`, err)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch task'
    })
  }

})


// DELETE A TASK BY id
router.put('/task/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {discarded: true}
    });

    return res.json(deletedTask)
    // return res.status(204).end();  //sucess but no response body

  } catch(error) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    } else {
      console.error('Error deleting task:', error)
      res.status(500).json({
        error: 'Internal Error server',
        message: 'Failed to delete task'
      });
    }
  }
})


// EDIT A TASK BY id
router.put('/task/edit/:id', async (req, res) => {

  try {
    // validation
    const {error, value} = taskSchema.validate(req.body)
    if (error) {
      console.error(error)
      return res.status(400).json({
        error: error.details[0].message,
        message: 'Validation error'
      });
    }

    // proceed if validation passes
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTask = await prisma.task.update({
      where: {id: Number(id) },
      data: {
        title,
        description,
        completed
      },
    });

    return res.json(updatedTask)

  } catch (error) {
    if (error.code === 'P2025') { // Prisma not found error
      res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    } else {
      console.error('Error updating task:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update task'
      });
    }
  }
})

// GET DISCARDED TASKS in PAGE p
router.get('/tasks/discarded/page/:p', async (req, res) => {
  const { p } = req.params;
  const pageSize = 10;

  try {
    const tasks = await prisma.task.findMany({
      where: { discarded: true },     // find discarded tasks
      orderBy: { updatedAt: 'desc'},  // Show most recently discarded first
      skip: (p-1)*pageSize,
      take: pageSize
    });
    return res.json(tasks);

  } catch (err) {
    console.error(`Error fetching discarded tasks page ${p}`, err);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch discarded tasks'
    })
  }
});

module.exports = router;
