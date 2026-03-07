LEARNHUB - E-LEARNING PLATFORM

A comprehensive, full-stack e-learning platform designed to bridge the gap between educators and learners. LearnHub features dedicated portals for Students, Tutors, and Administrators, offering a seamless experience for course creation, video streaming, interactive quizzes, and real-time progress tracking.

🚀 KEY FEATURES
For Students:

Interactive Dashboard: Track enrolled courses, earned certificates, and learning hours.

Dynamic Learning Environment: Seamlessly switch between video lectures and interactive quiz assessments.

Progress Tracking: Automatic progress bars and completion status for every lesson.

Student Q&A: Post comments, ask questions, and interact with tutors on specific lessons.

Private Notes: Integrated markdown note-taking system that auto-saves to local storage.

For Tutors:

Tutor Panel: A dedicated portal to manage courses, students, and track financial earnings.

Course Builder: Upload video lessons, create multi-choice quizzes, and set course pricing.

Status Management: Toggle courses between "Draft" and "Published" states instantly.

Engagement: View and reply to student queries directly from the dashboard.

Global Features:

Role-Based Authentication: Secure JWT login for Admins, Tutors, and Students.

Dark / Light Mode: Fully responsive, premium UI built with Tailwind CSS glassmorphism.

Media Uploads: Local file uploading system for course thumbnails and video content via Multer.

🛠️ TECH STACK
Frontend:

React.js (Vite)

Tailwind CSS (Styling & Dark Mode)

React Router DOM (Navigation)

Axios (API Requests)

Lucide React (Icons)

Backend:

Node.js & Express.js

MongoDB & Mongoose (Database & ORM)

JSON Web Tokens (JWT Authentication)

Multer (File & Video Uploads)

Bcrypt.js (Password Hashing)

📋 PREREQUISITES
Before you begin, ensure you have the following installed on your local machine:

Node.js (v16.x or higher)

MongoDB (Local or Atlas URI)

Git

⚙️ INSTALLATION & SETUP
1. Clone the repository

Bash
git clone https://github.com/vinaysahani21/LearnHub.git
cd LearnHub
2. Setup the Backend (Server)

Bash
cd server
npm install
3. Setup the Frontend (Client)
Open a new terminal window/tab:

Bash
cd client
npm install
🔐 ENVIRONMENT VARIABLES
You need to create a .env file in the server directory to connect your database and secure your sessions.

Create a file named .env inside the /server folder and add the following:

Code snippet
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/learnhub
# (Or use your MongoDB Atlas connection string)

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
💻 USAGE / RUNNING THE APP
To run the application locally, you will need to start both the backend server and the frontend development server.

Start the Backend:

Bash
cd server
npm run dev
# Server will start running on http://localhost:5000
Start the Frontend:
Open a separate terminal window:

Bash
cd client
npm run dev
# Client will start running on http://localhost:5173 (or similar Vite port)
📁 PROJECT STRUCTURE
Plaintext
LearnHub/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/                
│   │   ├── context/        # Global state (Auth, Theme)
│   │   ├── modules/        # Role-based features (Admin, Tutor, Student)
│   │   ├── core/           # Reusable UI components (Navbar, Buttons)
│   │   ├── App.jsx         # Main router
│   │   └── main.jsx        # React entry point
│   └── tailwind.config.js  # Tailwind theme configuration
│
├── server/                 # Node.js Backend
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & Role verification
│   ├── models/             # Mongoose schemas (User, Course, Comment)
│   ├── routes/             # API endpoints
│   ├── uploads/            # Local media storage (Ignored in Git)
│   └── server.js           # Express entry point
│
├── .gitignore              # Root gitignore
└── README.md               # Project documentation
🤝 CONTRIBUTING
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 LICENSE
This project is licensed under the MIT License - see the LICENSE file for details.