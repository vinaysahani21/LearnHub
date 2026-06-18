require('dotenv').config();
const mongoose = require('mongoose');

async function fixDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const Course = require('./models/Course');
  const User = require('./models/User');

  const courses = await Course.find();
  for (let course of courses) {
    let changed = false;
    if (course.thumbnail && course.thumbnail.includes('http://localhost:5000')) {
      course.thumbnail = course.thumbnail.replace('http://localhost:5000', 'https://learnhub-0vyb.onrender.com');
      changed = true;
    }
    
    for (let lesson of course.lessons) {
      if (lesson.videoUrl && lesson.videoUrl.includes('http://localhost:5000')) {
        lesson.videoUrl = lesson.videoUrl.replace('http://localhost:5000', 'https://learnhub-0vyb.onrender.com');
        changed = true;
      }
    }
    if (changed) {
      await course.save();
      console.log(`Updated course ${course._id}`);
    }
  }

  const users = await User.find();
  for (let user of users) {
    if (user.profilePicture && user.profilePicture.includes('http://localhost:5000')) {
      user.profilePicture = user.profilePicture.replace('http://localhost:5000', 'https://learnhub-0vyb.onrender.com');
      await user.save();
      console.log(`Updated user ${user._id}`);
    }
  }

  console.log("Done");
  process.exit();
}

fixDb();
