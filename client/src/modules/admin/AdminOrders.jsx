import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Download, CheckCircle, Clock, AlertCircle, 
  IndianRupee, FileText, TrendingUp, ShoppingBag, 
  Percent, ArrowUpRight, Search, Filter, Ban
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // --- FINANCIAL ANALYTICS ENGINE ---
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.razorpayOrderId && o.razorpayOrderId.includes(searchTerm));
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'paid') return matchesSearch && (o.status === 'completed' || o.status === 'paid');
    return matchesSearch && o.status === statusFilter;
  });

  const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'paid')
                             .reduce((sum, order) => sum + (order.amount || 0), 0);
                             
  const abandonedRevenue = orders.filter(o => o.status === 'pending')
                                 .reduce((sum, order) => sum + (order.amount || 0), 0);

  const successRate = orders.length > 0 
    ? Math.round((orders.filter(o => o.status === 'completed' || o.status === 'paid').length / orders.length) * 100) 
    : 0;

  // --- SMART EXPORT ---
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return alert("No data to export in the current view.");
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Student Name,Student Email,Course,Amount (INR),Status,Date\n";

    filteredOrders.forEach(order => {
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
    link.setAttribute("download", `LearnHub_Finance_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const isPaid = status === 'completed' || status === 'paid';
    const isPending = status === 'pending';
    
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit shadow-sm transition-colors
        ${isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
          isPending ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' : 
          'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}`}>
        {isPaid ? <CheckCircle size={12}/> : isPending ? <Clock size={12}/> : <Ban size={12}/>}
        {isPaid ? 'Paid' : isPending ? 'Abandoned' : 'Failed'}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Decrypting Financials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Financial Ledger <FileText className="text-red-600 dark:text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Audit platform transactions, track abandoned carts, and monitor revenue.</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-emerald-100 dark:border-emerald-500/20"><IndianRupee size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Secured Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-orange-200 dark:hover:border-orange-500/30 transition-colors">
          <div className="p-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-orange-100 dark:border-orange-500/20"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Abandoned Cart Value</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{abandonedRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-blue-100 dark:border-blue-500/20"><Percent size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Checkout Success Rate</p>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-2xl font-black text-slate-900 dark:text-white">{successRate}%</p>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded"><ArrowUpRight size={12}/> Conversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search transactions, students, or IDs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex-1 sm:flex-none">
            <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500"><Filter size={14} /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent py-2.5 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none w-full">
              <option value="all">All Transactions</option>
              <option value="paid">Successful (Paid)</option>
              <option value="pending">Abandoned (Pending)</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 dark:shadow-none transition-all active:scale-95 whitespace-nowrap flex-1 sm:flex-none"
          >
            <Download size={16} /> Export {statusFilter !== 'all' && statusFilter}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black">
                <th className="p-5 pl-6 whitespace-nowrap">Order ID</th>
                <th className="p-5 whitespace-nowrap">Customer</th>
                <th className="p-5 whitespace-nowrap">Course Asset</th>
                <th className="p-5 whitespace-nowrap">Value</th>
                <th className="p-5 whitespace-nowrap">Status</th>
                <th className="p-5 pr-6 text-right whitespace-nowrap">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-slate-500 dark:text-slate-400 font-medium">
                    <AlertCircle size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No records found.</p>
                    <p className="text-xs mt-1">Try adjusting your filters or search.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5 pl-6">
                      <p className="font-mono text-[11px] font-black text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors uppercase bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700/50 w-fit">
                        #{order.razorpayOrderId ? order.razorpayOrderId.slice(-10) : order._id.slice(-10)}
                      </p>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-slate-900 dark:text-white text-sm">{order.user?.name || "Anonymous"}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{order.user?.email}</p>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm line-clamp-1 truncate max-w-[200px]">
                        {order.course?.title || "Legacy Content"}
                      </p>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-slate-900 dark:text-white flex items-center text-sm">
                        <IndianRupee size={14} className="text-emerald-500 dark:text-emerald-400 mr-0.5" /> {order.amount || 0}
                      </p>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(order.status || 'completed')}
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <p className="text-xs font-black text-slate-600 dark:text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">
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