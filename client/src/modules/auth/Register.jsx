import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios"; // Import axios

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your Node API
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );

      alert("Registration Successful! Please login.");
      navigate("/auth/login"); // Redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {" "}
        {/* Add onSubmit */}
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="name"
              type="text"
              required
              value={formData.name} // Bind value
              onChange={handleChange} // Bind change
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Min 8 characters"
            />
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">Want to teach?</p>
            <p className="text-xs text-gray-500">
              Apply to become an instructor.
            </p>
          </div>
          <Link
            to="/auth/register-tutor"
            className="text-xs font-bold text-indigo-600 bg-white px-3 py-2 rounded border border-indigo-200 hover:bg-indigo-50"
          >
            Apply Now
          </Link>
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
