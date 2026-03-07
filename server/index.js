const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

require('./models/User');  
require('./models/Course'); 

const progressRoutes = require('./routes/progressRoutes'); 
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});