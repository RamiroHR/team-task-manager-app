const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });

// Setup prisma with test-DB credentials
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// import API and server
const { app, server } = require('../src/index.js');


// unit tests
describe('Test the api endpoints', () => {
  let taskId;
  let taskTitle;


  // Clear the test database before runing test sequence
  beforeAll(async () => {
    await prisma.task.deleteMany();    // delete all tasks
  })


  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();     // Close Prisma connection
    server.close();                 // Close the Express server
  });


  // Test POST /api/tasks (Create a new task)
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/task/new')
      .send({ title: 'New Test Task' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Test Task');
    expect(response.body.completed).toBe(false);

    taskId = response.body.id;        // Save the task ID & Title for later tests
    taskTitle = response.body.title;
  });


  // Test GET /api/tasks (Get all tasks)
  it('should get a non empty list', async () => {
    const response = await request(app)
      .get('/api/tasks');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  })


  // Test GET /api/task/:id (Get a single task by ID)
  it('should get a single task by ID', async () => {
    const response = await request(app)
      .get(`/api/task/${taskId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe(taskTitle);
    expect(response.body.completed).toBe(false);
  });


  // Test GET /api/task/:id (Task NOT found)
  it('should return 200(404) for a non existent task', async () => {
    const nonExistentTaskId = 9999;

    const response = await request(app)
      .get(`/api/task/${nonExistentTaskId}`);

    expect(response.statusCode).toBe(200);   // >>>>>> change to be 404 after handdling errors
  });


  // Test PUT /api/task/edit/:id (Update a task TITLE)
  it('should update a task title', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .send({ title: 'Updated title' });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Updated title');
    expect(response.body.completed).toBe(false);
  })


  // Test PUT /api/task/edit/:id (Update a task  STATUS)
  it('should update a task status', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .send({ completed: true
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Updated title');
    expect(response.body.completed).toBe(true);
  })


  // Test PUT /api/task/edit/:id (Verify that UPDATED DATE updates correctly)
  it('should update a task updatedDate', async () => {

    // get previus update date
    const initialTask = await request(app)
      .get(`/api/task/${taskId}`);

    const initialUpdatedDate = new Date(initialTask.body.updatedAt);

    // update task
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .send({ title: 'Re-updated title',
              completed: false
      });

    // verify the update
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Re-updated title');
    expect(response.body.completed).toBe(false);

    // fetch again the task
    const updatedTask = await request(app)
      .get(`/api/task/${taskId}`);

    const newUpdatedDate = new Date(updatedTask.body.updatedAt);

    // compare updated dates:
    expect(newUpdatedDate.getTime()).toBeGreaterThan(initialUpdatedDate.getTime());
  })


  // test DELETE /api/task/delete/:id (Delete a task by ID)
  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/task/delete/${taskId}`);

    expect(response.statusCode).toBe(200);    // query successful

    // verify it is deleted
    const verification = await request(app)
      .get(`/api/task/${taskId}`);

    expect(verification.statusCode).toBe(200);  // >>>>>> change to be 404 after handdling errors
  })


});
