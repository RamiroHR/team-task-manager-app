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
  let userName;
  let userPass;
  let token;

  // Clear the test database before runing test sequence
  beforeAll(async () => {
    await prisma.task.deleteMany();    // delete all tasks
    await prisma.user.deleteMany();    // delete all users
  })


  // Clean up after all tests
  afterAll(async () => {
    await prisma.$disconnect();     // Close Prisma connection
    server.close();                 // Close the Express server
  });


  // Test Sing Up /api/auth/register (create a new user in user database)
  it('should signup a new user', async() => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testUser',
        password: 'testPassword'
      });

    expect(response.statusCode).toBe(201);
    userName = response.body.user.username;
    userPass = 'testPassword';
  })


  // Test Sing Up /api/auth/register (create a new user in user database)
  it('should NOT signup again a registered username', async() => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testUser',
        password: 'testPassword2'
      });

    expect(response.statusCode).toBe(500);
    expect(response.error).toBeDefined();
  })


  // Test Sing Up /api/auth/register (create a new user in user database)
  it('should NOT signup with invalid username', async() => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'invalidUsername',   // too long username (invalid)
        password: 'testPassword2'
      });

    expect(response.statusCode).toBe(400);
    expect(response.error).toBeDefined();
  })


  // Test Login /api/auth/login (with JWT token)
  it('should login an existing user', async() => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: userName,
        password: userPass
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  })


  // Test Login /api/auth/login (with JWT token)
  it('should NOT login if incorrect username (but valid)', async() => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'badUsername',
        password: userPass
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeDefined();
  })


  // Test Login /api/auth/login (with JWT token)
  it('should NOT login if incorrect password', async() => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: userName,
        password: 'wrongPassword'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeDefined();
  })


  // Test POST /api/tasks (Create a new task)
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Test Task' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Test Task');
    expect(response.body.completed).toBe(false);

    taskId = response.body.id;        // Save the task ID & Title for later tests
    taskTitle = response.body.title;
  });


  // Test GET /api/tasks (Get all tasks)
  it('should get a non task empty list', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  })


  // Test GET /api/task/:id (Get a single task by ID)
  it('should get a single task by ID', async () => {
    const response = await request(app)
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe(taskTitle);
    expect(response.body.completed).toBe(false);
  });


  // Test GET /api/task/:id (Task NOT found)
  it('should return 404 for a non existent task', async () => {
    const nonExistentTaskId = 9999;

    const response = await request(app)
      .get(`/api/task/${nonExistentTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);   // >>>>>> change to be 404 after handdling errors
  });


  // Test PUT /api/task/edit/:id (Update a task TITLE)
  it('should update a task title', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated title',
        completed: true
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Updated title');
    expect(response.body.completed).toBe(true);
  })


  // Test PUT /api/task/edit/:id (Verify that UPDATED DATE updates correctly)
  it('should update a task updatedDate properly', async () => {

    // get previus update date
    const initialTask = await request(app)
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    const initialUpdatedDate = new Date(initialTask.body.updatedAt);

    // update task
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
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
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    const newUpdatedDate = new Date(updatedTask.body.updatedAt);

    // compare updated dates:
    expect(newUpdatedDate.getTime()).toBeGreaterThan(initialUpdatedDate.getTime());
  })


  // test DELETE /api/task/delete/:id (Delete a task by ID)
  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/task/delete/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);    // deletion successful

    // verify it is deleted
    const verification = await request(app)
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(verification.statusCode).toBe(404);
  })


  // test DELETE /api/task/delete/:id (Delete a task by ID)
  it('should fail to delete a non existing task', async () => {
    const nonExistentTask = 9999;

    const response = await request(app)
      .delete(`/api/task/delete/${nonExistentTask}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  })



});
