# DevTrack — Developer Task Management System

## 1. Project Name and Description

**DevTrack** is a full-stack Developer Task Management System built using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application helps developers organize and manage their tasks through a responsive dashboard. Users can create, view, update, and delete tasks, search for specific tasks, filter them by status and priority, and monitor task statistics.

This project was developed as part of the **Software Engineer Intern — MERN Stack technical evaluation at StartupMeu**, with a focus on REST API development, database integration, reusable React components, validation, and maintainable code.

**GitHub Repository:** https://github.com/sejalP07/devtrack-mern

## 2. Features

- **Task CRUD Operations:** Create, view, update, and delete tasks.
- **Task Search:** Search tasks using a debounced search input.
- **Status Filtering:** Filter tasks by Todo, In Progress, and Done.
- **Priority Filtering:** Filter tasks by Low, Medium, and High priority.
- **Task Categories:** Organize tasks into Frontend, Backend, Database, DevOps, and Other categories.
- **Dashboard Statistics:** View total tasks, pending tasks, in-progress tasks, completed tasks, and high-priority tasks.
- **Form Validation:** Validate task titles and descriptions before submission.
- **Confirmation Dialog:** Confirm destructive actions before deleting tasks.
- **Loading and Error States:** Provide feedback during data fetching and when operations fail.
- **Success Notifications:** Display feedback after successful task operations.
- **Responsive UI:** Support different screen sizes with consistent styling.
- **MongoDB Persistence:** Store task information in MongoDB using Mongoose.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database for storing tasks |
| Express.js | Backend web framework and REST API |
| React.js | Frontend user interface |
| Node.js | JavaScript runtime for the backend |
| Mongoose | MongoDB object modeling and schema validation |
| Vite | Frontend development server and build tool |
| Axios | HTTP communication between frontend and backend |
| JavaScript | Application development |
| CSS | Responsive styling and UI design |
| dotenv | Environment variable configuration |
| CORS | Cross-origin request configuration |
| Git and GitHub | Version control and source code hosting |
| Kiro | AI-assisted development, debugging, and code improvement |

## 4. Setup and Installation Instructions

### Prerequisites

Before starting, ensure you have installed:

- Node.js and npm
- Git
- A MongoDB Atlas account or a local MongoDB instance

### Step 1: Clone the Repository

```bash
git clone https://github.com/sejalP07/devtrack-mern.git
cd devtrack-mern
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `server` directory with the following configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection URI.

For MongoDB Atlas, create a cluster and database user, configure network access, and copy your connection string from the Atlas dashboard.

**Security:** Keep `.env` out of version control. Never publish database credentials or secrets in the repository.

### Step 4: Install Frontend Dependencies

Open a second terminal from the project root and run:

```bash
cd client
npm install
```

## 5. How to Run the Application

Start the backend and frontend in separate terminals.

### Start the Backend

From the project root:

```bash
cd server
npm run dev
```

The backend API runs at:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### Start the Frontend

In a second terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

Ensure the backend is running and connected to MongoDB before using the application.

### Build the Frontend

To verify the production build, run this command from the `client` directory:

```bash
npm run build
```

## 6. AI Development Tool Used

**Selected Tool: Kiro**

Kiro was used throughout the development of DevTrack as an AI-assisted development tool.

It helped with implementing application components, building backend functionality, reviewing code, debugging issues, and improving the overall quality of the application.

## 7. AI Development Experience

My experience using Kiro was iterative and focused on solving development tasks in manageable steps.

I used Kiro to assist with implementation and code review, then checked the generated changes, tested application behavior, and refined the code when necessary.

Rather than relying entirely on generated code, I focused on understanding how the frontend, backend, API routes, controllers, and database models work together.

This approach helped me improve my understanding of full-stack development, debugging, code organization, and the importance of verifying AI-generated solutions.

## 8. Specific Tasks Where I Used Kiro

### 1. Component Development

Used Kiro to help develop and refine reusable React components, including task cards, task lists, task forms, search and filter controls, and confirmation dialogs. Integrated these components into the dashboard and improved loading, error, and empty states.

### 2. REST API Creation

Used Kiro to assist in implementing Express.js REST API endpoints for creating, retrieving, updating, and deleting tasks. Also worked on search, filtering, task statistics, and consistent API responses.

### 3. MongoDB Database Integration

Used Kiro to help implement the Mongoose task schema, configure the MongoDB connection, define validation rules, and troubleshoot database connectivity. Verified that task operations worked with persistent database storage.

### 4. Debugging and Problem Solving

Used Kiro to investigate implementation issues, improve error handling, check API behavior, and resolve frontend integration problems. Verified fixes by running the application and checking the affected functionality.

### 5. Refactoring and Testing

Used Kiro to review and improve form validation, responsive layouts, keyboard-focus indicators, disabled states, and search interactions. Checked the frontend production build and tested the main application workflows during development.

---

**Developed by Sejal P.**

GitHub: https://github.com/sejalP07

Project: https://github.com/sejalP07/devtrack-mern
