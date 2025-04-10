# **Task Manager App**
App de gestion de tareas para equipos remotos.  
Full stack development.

Visit the app on https://task-manager-evavrv1im-ramiros-projects-3a362cea.vercel.app  

v1.2.0
![alt text](./images/app-view.png)

## **Functionalities**
Users will be able to:
- [x] See a list of taks.
- [x] Add new tasks.
- [x] Delete tasks.
- [x] Edit Existing tasks.
- [x] Add and edit a task description field
- [x] Soft delete tasks (Recycle bin)
- [ ] Add user specific tasks

## **Features**
- [x] Authentication login/logout (JWT).
- [x] Uses salting passwords (security)
- [x] Local Storage - Keep tasks status between sesions.
- [x] Uses ORM to manage database queries (Prisma).
- [x] Error Handling.
- [x] Input validations (Joi).
- [x] minimize rendrings (hooks)
- [x] modular code
- [/] Optimize re-renderings

# **Setup & Launch**

### **Database**  
Update the `./backend/.env` file with the PostgreSQL connection string, jwt secret key and the frontend url (local or webhosted):
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET="<your-secret-key>"
FRONTEND_URL=http://localhost:5173
```  


### **Backend** 
To setup the backend for the first time, execute:
   ```
   cd  backend
   npm install
   npm run setup:prisma
   ```

then, to launch the backend for production **or** in a development environment:
   ```
   npm run start   // for production
   npm run dev     // for development 
   ```

The backend runs in `http://localhost:5000/api/`


### **Frontend**
Setup a `./frontend/.env.production` using the template file `./frontend/.env.production.example`.  
Leave the `./frontend/.env.development` as it is (empty url)

To setup the frontend for the first time, execute:
   ```
   cd  frontend
   npm install
   npm run dev
   ```
The frontend tipically runs at `http://localhost:5173`



# **Miscellaneous (for development)**

### **API url in deployment**
Ensure the frontend points to the correct backend URL (e.g., `http://localhost:5000/my_endpoint`).


### **Testing the Integration**
1. Open the backend in the browser, directed to my endpoint (`http://localhost:5000/my_endpoint`) or query with CURL to verify the data is fetched from the database.
2. Open the frontend in the browser (`http://localhost:5173`).
3. Verify the frontend can fetch data from the backend.



### **Querying API endpoints**
While frontend is in development, the backend api endpoints can be tested with CURL:

**Register a new user**
```
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "user07", "password": "pass07"}'
```

**Login an existen user**
```
curl -X POST http://localhost:5000/api/auth/login \
-d '{"username": "user07", "password": "pass07"}'
```
Save the `<jwt_token>` token returned in the `response.body.token`  


**Get all tasks**
```
curl  http://localhost:5000/api/tasks 
```


**Get a tasks with id=10 (protected endpoint example)**
```
curl  http://localhost:5000/api/task/10 \
-H "Authorization: Bearer <jwt_token>" 
```

**Create a new task**
```
curl -X POST http://localhost:5000/api/task/new \
-H "Authorization: Bearer <jwt_token>" \
-d '{"title": "My New Task"}'
```

**Get a tasks with id=8**
```
$ curl -X DELETE http://localhost:5000/api/task/delete/8 \
-H "Authorization: Bearer <jwt_token>" 
```

**Edit tasks with id=15**
```
curl -X PUT http://localhost:5000/api/task/edit/15 \
-H "Authorization: Bearer <jwt_token>" \
-d '{"title": "Renamed Task", "completed": true}'
```


## **Testing Setup**
Unit tests for the backend API endpoints reaches 80% coverage. The tests will be performed using a _test databse_ configured in the `.env.test` file along with other test environment variables. 

1. **Create a `.env.test` file** in the `backend/` directory with:
   ```
   DATABASE_URL="your_test_db_connection_string"
   PORT=5001
   NODE_ENV=test
   JWT_SECRET="secret-key"
   FRONTEND_URL=http://localhost:5173    #or web hosted frontend url
   ```
Use `.env.test.example` as a template to create your `.env.test`.

2. **Requirements**:
   - Use a **dedicated test database** (never the production database).
   - The test DB should be empty/migrated before running tests.

3. **Run tests**:
   ```
   cd backend
   npm run test
   npm run test:coverage     # to get coverage repport in ./backend/__tests__/__output__/
   ```
GitHub Actions is configured to also run the same unit tests after a `merge` or `push` on the **main** and **develop** branches.
