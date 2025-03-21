const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });

const { PrismaClient } = require('@prisma/client');

const { app, server} = require('../src/index.js'); // Import app, server, and prisma

const prisma = new PrismaClient();


describe('Test the root path', () => {
  let taskId; // = 1;
  // let taskTitle = "new task today"

  // Test POST /api/tasks (Create a new task)
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/task/new')
      .send({ title: 'Test Task RHR' })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Task RHR');
    expect(response.body.completed).toBe(false);

    taskId = response.body.id; // Save the task ID for later tests
  });

  // // Test GET /api/tasks (Get all tasks)
  // it('should respond with 200', async () => {
  //   const response = await request(app).get('/api/tasks');
  //   expect(response.statusCode).toBe(200);
  // });

  // Test GET /api/tasks/:id (Get a single task by ID)
  it('should get a single task by ID', async () => {
    const response = await request(app)
      .get(`/api/task/${taskId}`)
      .expect(200);

    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Test Task RHR');
  });

  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect(); // Close Prisma connection
    server.close(); // Close the Express server
  });
});
