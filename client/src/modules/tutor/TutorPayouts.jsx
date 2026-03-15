import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Wallet, IndianRupee, ArrowUpRight, Clock, 
  CheckCircle, XCircle, Loader2, Landmark, 
  CreditCard, X, ShieldCheck, ChevronRight, TrendingUp
} from 'lucide-react';

const TutorPayouts = () => {
  const [data, setData] = useState({ balance: 0, totalEarned: 0, totalWithdrawn: 0, history: [] });
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'Bank Transfer',
    paymentDetails: ''
  });

  const fetchPayoutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tutor/payouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch payout data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (formData.amount > data.balance) return alert("You cannot request more than your available balance.");
    
    setRequestLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tutor/payouts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      setFormData({ amount: '', paymentMethod: 'Bank Transfer', paymentDetails: '' });
      fetchPayoutData(); // Refresh the data instantly
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setRequestLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><CheckCircle size={12}/> Cleared</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><XCircle size={12}/> Rejected</span>;
    return <span className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><Clock size={12}/> Processing</span>;
  };

  // Studio Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Securing Connection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Financial Hub <Wallet className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your earnings, request withdrawals, and view history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* PREMIUM DIGITAL WALLET CARD */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden flex flex-col justify-between min-h-[220px] group">
          <div className="absolute -right-6 -bottom-6 text-white/5 transform group-hover:scale-110 transition-transform duration-500 rotate-12">
             <Landmark size={180} strokeWidth={2} />
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck size={14} className="text-emerald-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Verified Balance</span>
             </div>
             <Wallet size={24} className="text-indigo-300 opacity-50" />
          </div>

          <div className="relative z-10 mt-8 flex justify-between items-end">
            <div>
               <p className="text-sm font-medium text-indigo-200 mb-1">Available for Withdrawal</p>
               <h2 className="text-5xl font-black tracking-tighter flex items-center gap-1">
                 <IndianRupee size={36} className="opacity-70 mt-1" />
                 {data.balance.toLocaleString()}
               </h2>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={data.balance <= 0}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Withdraw <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="flex flex-col gap-4">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-center group hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg"><CheckCircle size={16}/></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Withdrawn</p>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹{data.totalWithdrawn.toLocaleString()}</p>
           </div>
           
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-center group hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg"><TrendingUp size={16}/></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">All-Time Net Earnings</p>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹{data.totalEarned.toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
           <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Ledger History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-5 pl-6">Reference ID</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Destination</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {data.history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400 font-medium italic">No payout history found.</td>
                </tr>
              ) : (
                data.history.map(payout => (
                  <tr key={payout._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-5 pl-6 font-mono text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase">
                      #{payout._id.slice(-8)}
                    </td>
                    <td className="p-5 font-black text-slate-900 dark:text-white flex items-center gap-1">
                      <IndianRupee size={14} className="text-slate-400"/> {payout.amount.toLocaleString()}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                         <CreditCard size={14} className="text-indigo-400"/>
                         <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{payout.paymentMethod}</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">{payout.paymentDetails}</p>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(payout.status)}
                    </td>
                    <td className="p-5 pr-6 text-right text-xs font-bold text-slate-500">
                      {new Date(payout.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST PAYOUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark size={20} className="text-indigo-500"/> Request Transfer
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={handleRequestPayout} className="p-6 space-y-6">
              
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl flex justify-between items-center">
                 <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Available Funds</span>
                 <span className="text-lg font-black text-indigo-700 dark:text-indigo-300 tracking-tight">₹{data.balance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Amount to Withdraw (₹)</label>
                <input 
                  type="number" 
                  min="100"
                  max={data.balance}
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  required
                  placeholder="Enter amount..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Transfer Method</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none"
                >
                  <option>Bank Transfer (NEFT/IMPS)</option>
                  <option>UPI</option>
                  <option>PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Account / UPI Details</label>
                <input 
                  type="text" 
                  value={formData.paymentDetails}
                  onChange={(e) => setFormData({...formData, paymentDetails: e.target.value})}
                  required
                  placeholder="e.g. user@okhdfcbank or A/c 123456789 IFSC: HDFC0001"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={requestLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {requestLoading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TutorPayouts;