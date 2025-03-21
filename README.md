# **Task Manager App**
App de gestion de tareas para equipos remotos.  
Full stack development.

v1.1.0
![alt text](./images/app-view.png)

## **Functionalities**
Users can:
- [x] See a list of taks.
- [ ] Add new tasks.
- [ ] Delete tasks.
- [ ] Edit Existing tasks.

## **Features**
- [ ] Authentication login/logout (JWT).
- [ ] Local Storage - Keep tasks status between sesions.
- [x] Uses ORM to manage database queries (Prisma).
- [ ] Error Handling.
- [ ] Input validations (Joi).
- [ ] minimize rendrings (hooks)

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



## **Testing API endpoints**
While frontend is in development, the backend api endpoints can be tested with CURL:

**Get all tasks**
```
curl  http://localhost:5000/api/tasks 
```

**Get a tasks with id=10**
```
curl  http://localhost:5000/api/task/10 
```

**Create a new task**
```
curl -X POST http://localhost:5000/api/task/new \
-H "Content-Type: application/json" \
-d '{"title": "My New Task"}'
```

**Get a tasks with id=8**
```
$ curl -X DELETE http://localhost:5000/api/task/delete/8
```

**Edit tasks with id=15**
```
curl -X PUT http://localhost:5000/api/task/edit/15 \
-H "Content-Type: application/json" \
-d '{"title": "Renamed Task", "completed": true}'
```

