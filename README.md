# TaskFlow Backend 🧠

A simple and secure backend API for **TaskFlow**, a task tracking application where users can manage projects and tasks efficiently.

---

## 📆 Tech Stack

- **Express.js** – Backend framework
- **MongoDB** – NoSQL database (native driver, no Mongoose)
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **dotenv** – Environment variable management

---

## 🔐 Features

- User Authentication (Signup & Login)
- Each user can have **up to 4 projects**
- CRUD operations for:
  - Projects
  - Tasks
- Task progress tracking with `status` and `completedAt`

---

## 📁 Folder Structure

```
.
├── controllers/        # Route logic (auth, projects, tasks)
├── routes/             # API routes
├── middleware/         # Authentication middleware
├── config/             # MongoDB connection setup
├── app.js              # Main express app
├── .env                # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/<your-username>/taskflow-backend.git
cd taskflow-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

4. **Run the server**
```bash
node app.js
```

---

## 🛠 API Endpoints (Summary)

### Auth Routes
- `POST /auth/register` – Register user
- `POST /auth/login` – Login user

### Project Routes
- `POST /projects/create` – Create new project
- `GET /projects` – View all projects for logged-in user

### Task Routes
- `POST /tasks/create/:projectId` – Create task for a project
- `PATCH /tasks/:taskId` – Update task
- `DELETE /tasks/:taskId` – Delete task
- `GET /tasks/:projectId` – View all tasks under a project

---

## 🔐 Authentication

All protected routes require an **Authorization** header:
```
Authorization: Bearer <token>
```

---

## 🧑‍💻 Author

Made with ❤️ by **Arbaz**  
Feel free to contribute or give feedback.

---

