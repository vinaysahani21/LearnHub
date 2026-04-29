const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

// 🛡️ STABLE SECURITY PACKAGES
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('./models/User');  
require('./models/Course'); 

const progressRoutes = require('./routes/progressRoutes'); 
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const tutorRoutes = require('./routes/tutorRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CRITICAL FOR RENDER: Tells Express to trust the Render load balancer
app.set('trust proxy', 1);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}));

// ==========================================
// 🛡️ THE SECURITY SHIELD (STABLE)
// ==========================================

// 1. Set Security HTTP Headers 
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, 
  message: { message: "Too many requests from this IP, please try again in 15 minutes." }
});
app.use('/api/', limiter); 

// 3. Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// REMOVED xss-clean and express-mongo-sanitize to prevent IncomingMessage crashes

// ==========================================

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnhub')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/progress', progressRoutes); 
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/tutor', tutorRoutes);
app.use('/api/student', studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});