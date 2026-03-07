import { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'completed') return <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold uppercase"><CheckCircle size={12}/> Paid</span>;
    if (status === 'pending') return <span className="flex items-center gap-1 text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs font-bold uppercase"><Clock size={12}/> Pending</span>;
    return <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold uppercase"><AlertCircle size={12}/> Failed</span>;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Records</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course Purchased</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  #{order.razorpayOrderId ? order.razorpayOrderId.slice(-8) : order._id.slice(-8)}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.user?.name || "Unknown User"}
                </td>
                <td className="px-6 py-4 text-indigo-600 font-medium">
                  {order.course?.title || "Deleted Course"}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  ₹{order.amount}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 text-right text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;