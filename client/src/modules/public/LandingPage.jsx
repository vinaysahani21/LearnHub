import { useState, useEffect } from 'react'; // Import Hooks
import { ArrowRight, CheckCircle, Play, Star, Zap, Users, Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import CourseCard from '../../common/CourseCard'; 

const HERO_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80";

const FEATURES = [
  { icon: <Zap className="w-6 h-6 text-indigo-600" />, title: "Learn at your own pace", desc: "Enjoy lifetime access to courses." },
  { icon: <Users className="w-6 h-6 text-indigo-600" />, title: "Learn from experts", desc: "Select from top instructors." },
  { icon: <Play className="w-6 h-6 text-indigo-600" />, title: "Video courses", desc: "Build your library." },
  { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "Verified Certificates", desc: "Earn a certificate." }
];

const LandingPage = () => {
  // 1. State for Real Data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="overflow-hidden">
      
      {/* HERO SECTION (Unchanged) */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-br from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-4">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                New: Tutor Panel Live
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                Master skills that <br className="hidden lg:block" />
                <span className="text-indigo-600">drive your future</span>
              </h1>
              <p className="mt-4 text-lg text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Join thousands of students learning React, Node.js, and Data Science. 
              </p>
              
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg shadow-lg hover:shadow-indigo-500/30 transition-all">
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/auth/register" className="inline-flex justify-center items-center px-8 py-3 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-all">
                  <Play className="mr-2 w-4 h-4 text-gray-400 fill-current" />
                  View Demo
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img className="w-full" src={HERO_IMAGE} alt="Students learning" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION (Unchanged) */}
      <section className="bg-indigo-900 py-10 border-y border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {[
              { label: 'Active Students', value: '10k+' },
              { label: 'Total Courses', value: '250+' },
              { label: 'Expert Tutors', value: '120+' },
              { label: 'Satisfaction', value: '4.9/5' },
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-indigo-200 text-sm mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING COURSES SECTION (UPDATED FOR REAL DATA) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore Featured Courses
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Choose from online video courses with new additions published every month.
            </p>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Show top 3 courses only for landing page */}
              {courses.slice(0, 3).map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
              
              {courses.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No courses found. Be the first instructor to publish one!
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/courses" className="text-indigo-600 font-semibold hover:text-indigo-500 flex items-center justify-center gap-2">
              View all courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US (Unchanged) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-indigo-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) (Unchanged) */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/register" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Get Started for Free
            </Link>
            <Link to="/auth/register-tutor" className="bg-indigo-700 text-white border border-indigo-500 px-8 py-3 rounded-full font-bold hover:bg-indigo-800 transition-colors">
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;