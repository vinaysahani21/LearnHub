import React from 'react';
import { BookOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/student/courses/${course._id}`} className="block group bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">
          {course.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-gray-900 leading-tight">
          {course.title}
        </h3>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {course.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User size={16} className="mr-1" />
            <span>{course.tutor?.name || 'Instructor'}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            ₹{course.price}
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default CourseCard;