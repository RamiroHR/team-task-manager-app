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
    const userId = req.user.id            // from the authenticated request by authenticate midleware

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId,
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


// // GET TOP N MOST RECENT TASKS
// router.get('/tasks', async (req, res) => {

//   const N = 100;
//   const userId = req.user.id;

//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         userId,
//         discarded: false,
//       },
//       orderBy: { createdAt: 'asc' },
//       take: N,
//     });
//     return res.json(tasks);

//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({
//       error: 'Internal server Error',
//       message: 'Failed to tefch tasks'
//     });
//   }
// });


// GET TASKS in PAGE p
router.get('/tasks/page/:p', async (req, res) => {
  const { p } = req.params;
  const { completionFilter, sortField, sortOrder } = req.query;
  const pageSize = 10;
  const userId = req.user.id;

  try {

    //build where clause based on filters
    const where = {
      userId,
      discarded: false,
    };

    // Add completion filter if specified
    if (completionFilter === 'completed') {
      where.completed = true;
    } else if (completionFilter === 'uncompleted') {
      where.completed = false;
    }

    // Build sort order
    const orderBy = {};
    if (sortField === 'updatedAt' || sortField === 'createdAt') {
      orderBy[sortField] = sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else {
      // Default sort
      orderBy.createdAt = 'asc';
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      skip: (p-1)*pageSize,
      take: pageSize
    });

    return res.json(tasks);

  } catch (error) {
    console.error(`Error fetching page ${p}`, error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch page'
    })
  }
});


// GET A TASK BY id
router.get('/task/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      })
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        error:'Forbidden',
        message:'You do not have permission to view this task'
      });
    }

    if (task.discarded) {
      return res.status(404).json({
        error: 'Nor found',
        message: 'Task not found. Task discarded'
      })
    }

    return res.status(200).json(task)

  } catch (error) {
    console.error(`Error fetching task:`, error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch task'
    })
  }
});


// EDIT A TASK BY id
router.put('/task/edit/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }

    if (existingTask.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to edit this task'
      });
    }

    // validation
    const {error, value} = taskSchema.validate(req.body)
    if (error) {
      console.error(error)
      return res.status(400).json({
        error: error.details[0].message,
        message: 'Validation error'
      });
    }

    // proceed with update
    const { title, description, completed } = value;
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        completed
      }
    });

    return res.json(updatedTask)

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update task'
    });
  }
});


// DELETE A TASK BY id (soft delete)
router.put('/task/delete/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {

    // verify if task exists and belongs to the user
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return res.status(404).json({
        error:'Not found',
        message: 'Task not found'
      });
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this task'
      });
    }

    //Proceed with soft delete
    const deletedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { discarded: true }
    });

    return res.json(deletedTask)

  } catch(error) {
    console.error('Error deleting task:', error)
    res.status(500).json({
      error: 'Internal Error server',
      message: 'Failed to delete task'
    });
  }
})


// GET DISCARDED TASKS in PAGE p
router.get('/tasks/discarded/page/:p', async (req, res) => {
  const { p } = req.params;
  const { completionFilter, sortField, sortOrder } = req.query;
  const pageSize = 10;
  const userId = req.user.id;

  try {

    //build where clause based on filters
    const where = {
      userId,
      discarded: true,
      erased: false
    };

    // Add completion filter if specified
    if (completionFilter === 'completed') {
      where.completed = true;
    } else if (completionFilter === 'uncompleted') {
      where.completed = false;
    }

    // Build sort order
    const orderBy = {};
    if (sortField === 'updatedAt' || sortField === 'createdAt') {
      orderBy[sortField] = sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else {
      // By default show most recently discarded first
      orderBy.updatedAt = 'desc';
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      skip: (p-1)*pageSize,
      take: pageSize
    });
    return res.json(tasks);

  } catch (error) {
    console.error(`Error fetching discarded tasks page ${p}`, error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch discarded tasks'
    })
  }
});


// RESTORE A TASK FROM TRASH BIN
router.put('/task/restore/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try{
    // chekc if task exists and belong to user
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to restore this task'
      });
    }

    if (!task.discarded || task.erased) {
      return res.status(400).json({
        error: 'Bad request',
        messsage: 'Task cannot be restored'
      });
    }

    //Proceed with restore
    const restoredTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { discarded: false }
    });

    return res.json(restoredTask);

  } catch (error) {
    console.error('Error restoring task', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to restore task'
    });
  }
});


// PERMANENTLY DELETE A TASK (soft delete from trash bin)
router.put('/task/erase/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // First check if task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to erase this task'
      });
    }

    if (!task.discarded || task.erased) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Task cannot be erased'
      });
    }

    // Proceed with permanent deletion (soft delete)
    const erasedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { erased: true }
    });

    return res.json(erasedTask);

  } catch(error) {
    console.error('Error erasing task:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to erase task'
    });
  }
});


module.exports = router;
