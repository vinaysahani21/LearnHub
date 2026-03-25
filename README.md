# LearnHub: Premium LMS Ecosystem
LearnHub is an enterprise-grade Learning Management System (LMS) built with the MERN stack. It features a triple-panel architecture designed for high-performance content delivery, administrative control, and creator empowerment.


### 🛠 Tech Stack

Frontend: React.js, Tailwind CSS (Custom "Linear" Aesthetic)
Icons: Lucide-React
State Management: Context API (Auth & Theme)
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Certificates: html2canvas, jsPDF
File Handling: Multer (Local Storage / Cloudinary ready)

### 💎 Key Features

🏢 1. Admin OS (Red Theme)

Platform Analytics: Monitor total revenue, active users, and platform fees.
Content Auditing: Approve or reject courses with a cinematic preview player.
Finance Manager: Track all orders and process tutor payout requests.
User Database: Full CRUD control over the user base.
System Settings: Globally manage platform fee percentages.

🎨 2. Creator Studio (Indigo Theme)

Module Injector: Seamlessly upload video lectures or build interactive quizzes.
CRM Analytics: View "Lifetime Value" (LTV) for every student.
Financial Hub: Real-time wallet balance after platform fees with a payout request system.
Studio Preview: Test the student experience before publishing.

🎓 3. Student Theater (Sky Blue Theme)

Cinematic Player: A Netflix-inspired immersive learning interface.
Progress Tracking: Visual progress bars and automated "Mark as Complete" logic.
Verified Certificates: Dynamic, high-fidelity PDF certificates with unique verification IDs.
Class Forum: Lesson-specific discussion threads.
Local Notebook: Auto-saving module-specific notes using LocalStorage.

### ⚙️ Installation & 

1. Clone the repository

```bash
git clone https://github.com/your-username/learnhub.git
cd learnhub
```

2. Backend Setup
```bash
cd server
npm install
Create a .env file (see keys below)
npm start
```

3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 🔐 Environment Variables (.env)

You will need a .env file in the server directory with the following keys:
```bash
Code snippet
#SERVER CONFIG
PORT=5000
NODE_ENV=development

#DATABASE
MONGO_URI=your_mongodb_connection_string

#AUTHENTICATION
JWT_SECRET=your_super_secret_random_string
JWT_EXPIRE=30d

#FRONTEND CONNECTION
CLIENT_URL=http://localhost:5173

# FILE UPLOADS (If using local uploads)
UPLOAD_PATH=uploads
```

#### 🚀 Usage Details

How to use the panels:
Student: Register an account, explore the catalog, enroll in a course (even free ones), and complete modules to unlock your gold-sealed certificate.

Tutor: Register via /auth/register-tutor. Once in your Studio, create a new project, upload your thumbnail, inject video modules, and track your earnings.

Admin: Use the Admin login to oversee the entire operation. Approve new courses and click "Approved" on tutor payouts to settle balances.

📜 License
Distributed under the MIT License. See LICENSE for more information.

## Developed by Vinay Sahani.