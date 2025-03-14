# **Task Manager App**
App de gestion de tareas para equipos remotos.  
Full stack development.

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

---

### **Frontend Setup**
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
   npm start
   ```
   The frontend will run at `http://localhost:5173`.

---

### **Testing the Integration**
1. Open the backend in the browser, directed to my endpoint (`http://localhost:5000/my_endpoint`) or query with CURL to verify the data is fetched from the database.
2. Open the frontend in the browser (`http://localhost:5173`).
3. Verify the frontend can fetch data from the backend.

---
