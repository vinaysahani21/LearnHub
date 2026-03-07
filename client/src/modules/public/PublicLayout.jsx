import { Outlet, Link } from 'react-router-dom';
import { Search, Menu, X, Rocket } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                LearnHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="pl-10 pr-4 py-2 text-sm bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                />
              </div>
              <Link to="/courses" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Explore</Link>
              <Link to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log In</Link>
              <Link to="/auth/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Join for Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Learn</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Algorithms</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Web Dev</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Community</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Tutors</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">&copy; 2026 LearnHub Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;