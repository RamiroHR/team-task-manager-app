const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example: Create a task
async function createTask(title) {
  const task = await prisma.task.create({
    data: {
      title,
    },
  });
  return task;
}

// Example: Get all tasks
async function getAllTasks() {
  const tasks = await prisma.task.findMany();
  return tasks;
}

// Example usage
(async () => {
  const newTask = await createTask('My first task');
  console.log('Created task:', newTask);

  const tasks = await getAllTasks();
  console.log('All tasks:', tasks);
})();
