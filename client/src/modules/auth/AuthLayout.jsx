import { Outlet, Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* 1. Header (Logo) */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-900">LearnHub</span>
        </Link>
      </div>

      {/* 2. The Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-100 sm:rounded-xl sm:px-10 border border-gray-100">
          <Outlet /> {/* Login or Register form renders here */}
        </div>
        
        {/* Footer links */}
        <p className="mt-6 text-center text-sm text-gray-500">
          &copy; 2026 LearnHub Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;