import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link 
      to={`/student/courses/${course._id}`} 
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail Section */}
      <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle cinematic overlay */}
        <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-md uppercase tracking-widest border border-sky-100 dark:border-sky-500/20">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
          {course.description}
        </p>
        
        {/* Bottom Footer Section */}
        <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <User size={12} />
            </div>
            <span className="truncate max-w-[120px]">{course.tutor?.name || 'Expert Instructor'}</span>
          </div>
          
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;