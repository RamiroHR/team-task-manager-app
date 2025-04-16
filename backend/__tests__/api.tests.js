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
  let pageSize = 10;
  let taskId;
  let taskTitle;
  let userName;
  let userPass;
  let token;
  let fakeToken;

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

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Username already exists');
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
    fakeToken = token.slice(0,-5)+'xxxxx' // overwrite the last 5 chars of the valid token
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

  // Test Token Verification
  it('should verify a valid token', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.valid).toBe(true);
  });


  it('should reject invalid token verification', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(response.statusCode).toBe(400);
  });



  // Test POST /api/tasks (Create a new task)
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Test Task',
        description: 'Test task description'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Test Task');
    expect(response.body.description).toBe('Test task description');
    expect(response.body.completed).toBe(false);

    taskId = response.body.id;        // Save the task ID & Title for later tests
    taskTitle = response.body.title;
  });


  // Test GET /api/tasks/page/1 (Get all tasks)
  it('should get task of one page', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBeLessThanOrEqual(pageSize);
  })


  it('should get filtered completed tasks', async () => {
    // First create a completed task
    await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Completed Task',
        completed: true
      });

    // verify
    const response = await request(app)
      .get('/api/tasks/page/1?completionFilter=completed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(task => {
      expect(task.completed).toBe(true);
    });
  });


  it('should get filtered uncompleted tasks', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1?completionFilter=uncompleted')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(task => {
      expect(task.completed).toBe(false);
    });
  });


  it('should sort tasks by updatedAt', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1?sortField=updatedAt&sortOrder=desc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Verify descending order
    for(let i = 1; i < response.body.length; i++) {
      const prevDate = new Date(response.body[i-1].updatedAt);
      const currDate = new Date(response.body[i].updatedAt);
      expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
    }
  });


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


  it('should not allow access to another user\'s task', async () => {
    // Create another user
    const otherUserResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'otherUser',
        password: 'otherPassword'
      });

    // Login as other user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'otherUser',
        password: 'otherPassword'
      });

    const otherUserToken = loginResponse.body.token;

    // Try to access first user's task
    const response = await request(app)
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Forbidden');
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



  // Test validation error
  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`) // Fix the path to include /api
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',  // Invalid empty title
        completed: 'not-a-boolean' // Invalid boolean
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe('Validation error');
  });



  // Test not found error (P2025)
  it('should return 404 for non-existent task', async () => {
    const nonExistentId = 9999;
    const response = await request(app)
      .put(`/task/edit/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Valid Title', completed: true });

    expect(response.status).toBe(404);
  });


  // test SOFT DELETE /api/task/delete/:id (Delete a task by ID)
  it('should delete a task', async () => {
    const response = await request(app)
      .put(`/api/task/delete/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);      // soft deletion successfull
    expect(response.body.discarded).toBe(true)  // verify that returned task is discarded

    // verify it is not present in normal get request
    const verification = await request(app)
      .get(`/api/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(verification.statusCode).toBe(404);
  })


  // test DELETE /api/task/delete/:id (Delete a task by ID)
  it('should fail to delete a non existing task', async () => {
    const nonExistentTask = 9999;

    const response = await request(app)
      .put(`/api/task/delete/${nonExistentTask}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  })


  // Test error handling for task creation
  it('should handle invalid task data during creation', async () => {
    const response = await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // Missing title, which is required
        description: 'Test description'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe('Validation error.');
  });


  // Test sorting with invalid parameters
  it('should handle invalid sort parameters', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1?sortField=invalidField&sortOrder=invalid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200); // Should use default sorting
    expect(Array.isArray(response.body)).toBe(true);
  });


  // Test pagination with invalid page number
  it('should handle invalid page number', async () => {
    const response = await request(app)
      .get('/api/tasks/page/-1') // Invalid page number
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe('Failed to fetch page');
  });


  // Test task update with missing authorization
  it('should reject task update without authorization', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .send({ title: 'Updated Title' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Access denied. No token provided.');
  });


  // Test task update with invalid task data
  it('should handle invalid data in task update', async () => {
    const response = await request(app)
      .put(`/api/task/edit/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '', // Empty title
        invalidField: 'some value' // Invalid field
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.message).toBe('Validation error');
  });


  // Test task deletion with missing authorization
  it('should reject task deletion without authorization', async () => {
    const response = await request(app)
      .put(`/api/task/delete/${taskId}`)
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Access denied. No token provided.');
  });


  it('should not allow deletion of another user\'s task', async () => {
    // First create a task with the first user
    const taskResponse = await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task to test deletion',
        description: 'This task will be attempted to be deleted by another user'
      });

    const taskToDelete = taskResponse.body.id;

    // Create another user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'delUser2',
        password: 'password123'
      });

    // Login as the other user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'delUser2',
        password: 'password123'
      });

    const otherUserToken = loginResponse.body.token;

    // First verify the token is valid
    const verifyResponse = await request(app)
      .get('/api/tasks/page/1')
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(verifyResponse.statusCode).toBe(200);

    // Now try to delete the task as the other user
    const deleteResponse = await request(app)
      .put(`/api/task/delete/${taskToDelete}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(deleteResponse.statusCode).toBe(403);
    expect(deleteResponse.body.error).toBe('Forbidden');
  });



  // Test invalid completion filter
  it('should handle invalid completion filter', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1?completionFilter=invalid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200); // Should return all tasks without filtering
    expect(Array.isArray(response.body)).toBe(true);
  });


  // Test discarded tasks operations

  let discardedTaskId;

  beforeAll(async () => {
    // Create and discard a task
    const taskResponse = await request(app)
      .post('/api/task/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task to be discarded',
        description: 'This task will be discarded'
      });

    discardedTaskId = taskResponse.body.id;

    await request(app)
      .put(`/api/task/delete/${discardedTaskId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('should get filtered discarded tasks', async () => {
    const response = await request(app)
      .get('/api/tasks/discarded/page/1?completionFilter=uncompleted')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(task => {
      expect(task.completed).toBe(false);
    });
  });

  // Test auth error handling
  it('should handle server error during registration', async () => {
    // Temporarily modify username to trigger unique constraint
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: userName, // Using existing username to trigger error
        password: 'testPassword'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Username already exists');
  });

  it('should handle invalid token format', async () => {
    const response = await request(app)
      .get('/api/tasks/page/1')
      .set('Authorization', 'InvalidTokenFormat');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid token.');
  });

  it('should handle invalid registration data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: '', // Empty username
        password: 'password123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should handle server errors in login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: null, // This should cause a validation error
        password: 'password123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  });

});
