import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Banknote, CheckCircle, XCircle, Clock, 
  Loader2, IndianRupee, CreditCard, Calendar,
  ArrowUpRight, AlertCircle, Search, Filter, Download
} from 'lucide-react';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // Advanced UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); // Default to pending queue

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/payouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort so newest requested are at the top
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPayouts(sorted);
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

  // Export to CSV Function
  const handleExportCSV = () => {
    const dataToExport = filteredPayouts;
    if (dataToExport.length === 0) return alert("No data to export in current view.");

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Payout ID,Tutor Name,Amount (INR),Method,Details,Status,Requested Date,Processed Date\n";

    dataToExport.forEach(p => {
      const row = [
        p._id,
        p.tutor?.name || "Unknown",
        p.amount || 0,
        p.paymentMethod || "N/A",
        `"${p.paymentDetails || "N/A"}"`,
        p.status,
        new Date(p.createdAt).toLocaleDateString(),
        p.processedAt ? new Date(p.processedAt).toLocaleDateString() : "Pending"
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payout_Ledger_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- DATA PROCESSING ENGINE ---
  const filteredPayouts = payouts.filter(p => {
    const matchesSearch = (p.tutor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (p.paymentMethod?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = payouts.filter(p => p.status === 'pending').length;
  const pendingLiability = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPaidOut = payouts.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0);

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><CheckCircle size={12}/> Approved</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><XCircle size={12}/> Rejected</span>;
    return <span className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit"><Clock size={12}/> Pending Review</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Accessing Payout Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Payout Management <Banknote className="text-emerald-600 dark:text-emerald-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Review, audit, and authorize tutor withdrawal requests.</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="bg-[#0a0f1c] dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-slate-900/10 dark:shadow-none transition-colors">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 dark:text-emerald-100 uppercase tracking-[0.2em] leading-none">Action Queue</span>
                <span className="text-sm font-black text-red-500 dark:text-white">{pendingCount} Pending</span>
             </div>
             <div className="w-px h-6 bg-slate-800 dark:bg-emerald-500/50"></div>
             <AlertCircle size={18} className="text-red-500 dark:text-emerald-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* FINANCIAL LIABILITY WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl"><Clock size={20}/></div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Pending Liability (Owed)</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">₹{pendingLiability.toLocaleString()}</p>
             </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl"><CheckCircle size={20}/></div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Historically Paid</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">₹{totalPaidOut.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

      {/* CONTROL BAR (Search, Filters, Export) */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by tutor or method..." 
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
              <option value="pending">Action Queue (Pending)</option>
              <option value="approved">Approved History</option>
              <option value="rejected">Rejected History</option>
              <option value="all">All Payouts</option>
            </select>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 dark:shadow-none transition-all active:scale-95 whitespace-nowrap flex-1 sm:flex-none"
          >
            <Download size={16} /> Export Ledger
          </button>
        </div>
      </div>

      {/* PAYOUT TABLE AREA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
        {filteredPayouts.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
               <Banknote className="text-slate-300 dark:text-slate-500" size={32} />
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No payout requests in current view</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black">
                  <th className="p-4 pl-6 whitespace-nowrap">Beneficiary (Tutor)</th>
                  <th className="p-4 whitespace-nowrap">Disbursement Amount</th>
                  <th className="p-4 whitespace-nowrap">Gateway Details</th>
                  <th className="p-4 whitespace-nowrap">Authorization</th>
                  <th className="p-4 pr-6 text-right whitespace-nowrap">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredPayouts.map(payout => (
                  <tr key={payout._id} className={`transition-all duration-200 group ${payout.status === 'pending' ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30' : 'bg-slate-50/30 dark:bg-slate-900/50'}`}>
                    
                    {/* TUTOR DETAILS */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black text-sm border border-slate-200/60 dark:border-slate-700 shadow-inner">
                           {payout.tutor?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">{payout.tutor?.name || "Unknown Tutor"}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-tighter flex items-center gap-1">
                            <Calendar size={10}/> Req: {new Date(payout.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center text-lg tracking-tighter">
                          <IndianRupee size={16} className="opacity-60" /> {payout.amount?.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Net Payable</span>
                      </div>
                    </td>

                    {/* PAYMENT METHOD */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <CreditCard size={14} className="text-indigo-500 dark:text-indigo-400"/>
                        <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{payout.paymentMethod}</p>
                      </div>
                      <p className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md mt-1.5 w-fit border border-slate-200/60 dark:border-slate-700">
                        {payout.paymentDetails}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(payout.status)}
                      {payout.processedAt && (
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-[0.15em] flex items-center gap-1">
                          <CheckCircle size={10}/> {new Date(payout.processedAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 pr-6 text-right">
                      {payout.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          {processingId === payout._id ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                               <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={16} />
                               <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Processing</span>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleProcessPayout(payout._id, 'approved')}
                                className="group/btn px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg shadow-emerald-500/20 dark:shadow-none active:scale-95 flex items-center gap-2"
                              >
                                Approve <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleProcessPayout(payout._id, 'rejected')}
                                className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/30 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all active:scale-95"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-end pr-4 opacity-50">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${payout.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-100 dark:border-red-500/20'}`}>
                              {payout.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
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