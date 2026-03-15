import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Download, CheckCircle, Clock, AlertCircle, 
  IndianRupee, FileText, TrendingUp, ShoppingBag, 
  Percent, ArrowUpRight, Search 
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/orders', config);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  // Financial Analytics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const successRate = orders.length > 0 
    ? Math.round((orders.filter(o => o.status === 'completed' || o.status === 'paid').length / orders.length) * 100) 
    : 0;

  const handleExportCSV = () => {
    if (orders.length === 0) return alert("No data to export");
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Student Name,Student Email,Course,Amount (INR),Status,Date\n";

    orders.forEach(order => {
      const row = [
        order.razorpayOrderId || order._id,
        order.user?.name || "Unknown",
        order.user?.email || "N/A",
        `"${order.course?.title || "Deleted Course"}"`,
        order.amount || 0,
        order.status || "completed",
        new Date(order.createdAt).toLocaleDateString()
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LearnHub_Finance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const isPaid = status === 'completed' || status === 'paid';
    const isPending = status === 'pending';
    
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border w-fit shadow-sm
        ${isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          isPending ? 'bg-orange-50 text-orange-700 border-orange-200' : 
          'bg-red-50 text-red-700 border-red-200'}`}>
        {isPaid ? <CheckCircle size={12}/> : isPending ? <Clock size={12}/> : <AlertCircle size={12}/>}
        {isPaid ? 'Paid' : isPending ? 'Pending' : 'Failed'}
      </div>
    );
  };

  const filteredOrders = orders.filter(o => 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.razorpayOrderId && o.razorpayOrderId.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Decrypting Financials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Financial Ledger <FileText className="text-red-600" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Audit platform transactions and monitor revenue flow.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#0a0f1c] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 group hover:border-red-200 transition-colors">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform"><IndianRupee size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Revenue</p>
            <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 group hover:border-indigo-200 transition-colors">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Successful Sales</p>
            <p className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'completed' || o.status === 'paid').length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-colors">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><Percent size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success Rate</p>
            <div className="flex items-center gap-2">
               <p className="text-2xl font-black text-slate-900">{successRate}%</p>
               <span className="text-[10px] font-bold text-emerald-600 flex items-center"><ArrowUpRight size={12}/> Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-slate-400 font-bold">No records found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="p-4 pl-6">
                      <p className="font-mono text-[11px] font-black text-slate-400 group-hover:text-red-500 transition-colors uppercase">
                        #{order.razorpayOrderId ? order.razorpayOrderId.slice(-10) : order._id.slice(-10)}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-slate-900 text-sm">{order.user?.name || "Anonymous"}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-indigo-600 text-sm line-clamp-1 truncate max-w-[200px]">
                        {order.course?.title || "Legacy Content"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-slate-900 flex items-center text-sm">
                        <IndianRupee size={14} className="opacity-50" /> {order.amount || 0}
                      </p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status || 'completed')}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <p className="text-xs font-black text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;