import { DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react';

const TutorDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Instructor Dashboard</h1>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '₹45,200', icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-green-500' },
          { label: 'Total Students', value: '1,240', icon: <Users className="w-6 h-6 text-white" />, color: 'bg-blue-500' },
          { label: 'Total Courses', value: '8', icon: <BookOpen className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
          { label: 'Course Views', value: '12.5k', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-orange-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg shadow-md ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Recent Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Enrollments</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Course Purchased</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">Student #{i}</td>
                <td className="px-6 py-4">React Mastery 2026</td>
                <td className="px-6 py-4">Jan 31, 2026</td>
                <td className="px-6 py-4 text-green-600 font-bold">₹499</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorDashboard;