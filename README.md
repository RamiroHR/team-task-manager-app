# **Task Manager App**
App de gestion de tareas para equipos remotos.  
Full stack development.

v1.1.0
![alt text](./images/app-view.png)

## **Functionalities**
Users can:
- [x] See a list of taks.
- [x] Add new tasks.
- [x] Delete tasks.
- [/] Edit Existing tasks.

## **Features**
- [x] Authentication login/logout (JWT).
- [x] Local Storage - Keep tasks status between sesions.
- [x] Uses ORM to manage database queries (Prisma).
- [ ] Error Handling.
- [ ] Input validations (Joi).
- [x] minimize rendrings (hooks)
- [x] modular code

## **Setup Instructions**

### **Backend Setup**
Automatically setup the backend by executing from the root folder:
   ```
   ./backend-setup.sh/
   ```

or manualy setup following these steps:
1. Navigate to the backend directory:
   ```
   cd backend/
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:  
    Update the `.env` file with the PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"  
     ```  
    Run Prisma migrations:
     ```
     npx prisma migrate dev --name init
     ```
    Generate the Prisma Client:
     ```
     npx prisma generate
     ```
4. Start the backend server:
   ```
   node src/index.js               // or the other file: src/helper_index.jsx
   ```
   The backend will run at `http://localhost:5000`.  
   Try the `http://localhost:5000/api/tasks` endpoint.  

---

### **Frontend Setup**
Automatically setup the frontend by executing from the root folder:
   ```
   ./frontend-setup.sh/
   ```

or manualy setup following these steps:
1. Navigate to the frontend directory:
   ```
   cd frontend/
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the backend API URL:  
   Ensure the frontend points to the correct backend URL (e.g., `http://localhost:5000/my_endpoint`).

4. Start the frontend server:
   ```
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

### **Testing the Integration**
1. Open the backend in the browser, directed to my endpoint (`http://localhost:5000/my_endpoint`) or query with CURL to verify the data is fetched from the database.
2. Open the frontend in the browser (`http://localhost:5173`).
3. Verify the frontend can fetch data from the backend.



## **Querying API endpoints**
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

## **Unit Tests**
Unit tests for the backend API endpoints.
A test database is setup to run the unit test, with the connection URL is managed by a .env.test secret file.  
The unit tests can be runned locally executing:
```
cd backend
npm test
```

GitHub Actions is set to also run the same unit tests.
