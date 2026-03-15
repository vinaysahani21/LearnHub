import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Banknote, CheckCircle, XCircle, Clock, 
  Loader2, IndianRupee, CreditCard, Calendar,
  ArrowUpRight, AlertCircle, Search
} from 'lucide-react';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/payouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to fetch payouts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (id, status) => {
    const actionText = status === 'approved' ? 'APPROVE' : 'REJECT';
    if (!window.confirm(`⚠️ CONFIRM FINANCIAL ACTION:\nAre you sure you want to ${actionText} this withdrawal?`)) return;

    setProcessingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/admin/payouts/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPayouts(payouts.map(p => p._id === id ? { ...p, status: res.data.payout.status, processedAt: res.data.payout.processedAt } : p));
    } catch (err) {
      alert("Failed to process payout.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayouts = payouts.filter(p => 
    p.tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><CheckCircle size={12}/> Approved</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><XCircle size={12}/> Rejected</span>;
    return <span className="flex items-center gap-1.5 text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><Clock size={12}/> Pending Review</span>;
  };

  // Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Accessing Payout Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Payout Management <Banknote className="text-emerald-600" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Review, audit, and authorize tutor withdrawal requests.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by tutor name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="bg-[#0a0f1c] text-white px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-slate-900/10">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Queue</span>
                <span className="text-sm font-black text-red-500">{payouts.filter(p => p.status === 'pending').length} Pending</span>
             </div>
             <div className="w-px h-6 bg-slate-800"></div>
             <AlertCircle size={18} className="text-red-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* PAYOUT TABLE AREA */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
               <Banknote className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No payout requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                  <th className="p-4 pl-6">Beneficiary (Tutor)</th>
                  <th className="p-4">Disbursement Amount</th>
                  <th className="p-4">Gateway Details</th>
                  <th className="p-4">Authorization</th>
                  <th className="p-4 pr-6 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayouts.map(payout => (
                  <tr key={payout._id} className={`transition-all duration-200 group ${payout.status === 'pending' ? 'hover:bg-slate-50/80' : 'bg-slate-50/30'}`}>
                    
                    {/* TUTOR DETAILS */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xs border border-white shadow-sm">
                           {payout.tutor?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{payout.tutor?.name || "Unknown Tutor"}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter flex items-center gap-1">
                            <Calendar size={10}/> Req: {new Date(payout.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <p className="font-black text-emerald-600 flex items-center text-lg tracking-tighter">
                          <IndianRupee size={16} className="opacity-60" /> {payout.amount?.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Payable</span>
                      </div>
                    </td>

                    {/* PAYMENT METHOD */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <CreditCard size={14} className="text-indigo-500"/>
                        <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{payout.paymentMethod}</p>
                      </div>
                      <p className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1.5 w-fit border border-slate-200/60">
                        {payout.paymentDetails}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(payout.status)}
                      {payout.processedAt && (
                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.15em] flex items-center gap-1">
                          <CheckCircle size={10}/> {new Date(payout.processedAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 pr-6 text-right">
                      {payout.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          {processingId === payout._id ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                               <Loader2 className="animate-spin text-indigo-600" size={16} />
                               <span className="text-[10px] font-black text-slate-400 uppercase">Processing</span>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleProcessPayout(payout._id, 'approved')}
                                className="group/btn px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                              >
                                Approve <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleProcessPayout(payout._id, 'rejected')}
                                className="px-4 py-2 bg-white hover:bg-red-50 text-red-500 border border-slate-200 hover:border-red-200 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all active:scale-95"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-end pr-4">
                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                              <CheckCircle size={16} />
                           </div>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default PayoutManagement;