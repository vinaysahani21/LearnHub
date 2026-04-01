<div align="center">

  <h1>🚀 LearnHub: Premium E-Learning Platform</h1>
  <p><strong>An enterprise-grade Learning Management System built with the MERN stack.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/MERN_Stack-Informational?style=flat-square&logo=mongodb&color=47A248" alt="MERN" />
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
  </p>
</div>

<br />

LearnHub features a highly optimized, fully responsive **triple-panel architecture** designed for high-performance content delivery, administrative command, and creator empowerment. Complete with seamless Dark Mode adaptation and cinematic UI elements, it delivers a top-tier SaaS experience.

---

## 🛠 Tech Stack

* **Frontend:** React.js, React Router DOM, Tailwind CSS (Custom "Linear" Aesthetic)
* **UI Components:** Lucide-React (Icons)
* **State Management:** Context API (Auth & Theme)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Document Generation:** html2canvas, jsPDF (High-Fidelity Certificates)
* **File Handling:** Multer (Local Storage / Cloudinary ready)

---

## 💎 The Triple-Panel Architecture

### 🏢 1. Admin OS (Red "Command Center" Theme)
* **Global Broadcast Engine:** Push real-time, priority-based alerts to students and tutors.
* **Platform Analytics:** Monitor total revenue, active users, and abandoned cart metrics.
* **Content Moderation:** Audit, approve, or reject courses with a cinematic preview player.
* **Financial Vault:** Track all ledger orders and process tutor payout requests.
* **User Database:** Full CRUD control, suspension capabilities, and live role filtering.
* **System Configuration:** Globally manage platform fee percentages, maintenance mode, and auto-approval logic.

### 🎨 2. Creator Studio (Indigo "Creative" Theme)
* **Module Injector:** Seamlessly upload video lectures or build interactive assessments (quizzes).
* **CRM Analytics:** View "Lifetime Value" (LTV) for students and track course conversion rates.
* **Financial Hub:** Real-time wallet balance accounting for platform fees, with an integrated payout request system.
* **Studio Preview:** Safely test the student experience before publishing content.
* **Q&A Forum Management:** Engage directly with students on lesson-specific threads.

### 🎓 3. Student Theater (Sky Blue "Immersive" Theme)
* **Cinematic Player:** A Netflix-inspired, distraction-free learning interface.
* **Intelligent Progress Tracking:** Visual progress bars and automated "Mark as Complete" logic.
* **Verified Certificates:** Dynamic, high-fidelity PDF certificates with unique verification IDs and historical timestamps.
* **Local Notebook:** Auto-saving, module-specific notes utilizing LocalStorage.

---

## ⚙️ Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/learnhub.git
cd learnhub
```

**2. Backend Setup**
```bash
cd server
npm install
```

Create a .env file in the server directory (see configuration below).

```bash
node server.js
```

**3. Frontend Setup**
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

**🔐 Environment Variables (.env)**
Create a .env file in the root of your server directory.
```bash
# SERVER CONFIGURATION
PORT=5000
NODE_ENV=development

# DATABASE
MONGO_URI=your_mongodb_connection_string

# AUTHENTICATION
JWT_SECRET=your_super_secret_random_string
JWT_EXPIRE=30d

# FRONTEND CONNECTION
CLIENT_URL=http://localhost:5173
```

### 🚀 User Workflows
Student Experience: Register an account, explore the dynamic catalog, enroll in a course, and complete modules to unlock a gold-sealed, downloadable certificate.

Tutor Experience: Register via /auth/register-tutor. Access the Studio, draft a new project, upload cover art, inject video/quiz modules, publish the course, and request payouts from your earnings.

Admin Experience: Log in to the Admin OS to oversee the platform. Manage categories, moderate newly published content, broadcast announcements, and approve financial disbursements.



<div align="center" font>
<h3>
<p>Architected and Developed by <strong><h2>Vinay Sahani</h4></strong></p>
</h3>
</div>
