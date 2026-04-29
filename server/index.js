const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

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

//   CORS must allow credentials and specify the exact frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

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
  console.log(`Server running on http://localhost:${PORT}`);
});