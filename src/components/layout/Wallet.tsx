import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  History, Plus, X, CheckCircle2, ArrowUpRight, ArrowDownLeft, AlertCircle 
} from 'lucide-react';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'in' | 'out';
}

const Wallet: React.FC = () => {
  const { user } = useAuth();
  
  // --- LOCAL STORAGE LOGIC ---
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('bn_wallet_balance');
    return savedBalance ? parseFloat(savedBalance) : 24850.00;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTx = localStorage.getItem('bn_wallet_transactions');
    return savedTx ? JSON.parse(savedTx) : [];
  });

  useEffect(() => {
    localStorage.setItem('bn_wallet_balance', balance.toString());
    localStorage.setItem('bn_wallet_transactions', JSON.stringify(transactions));
  }, [balance, transactions]);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'send' | 'add'>('send');
  const [amount, setAmount] = useState('');
  const [targetName, setTargetName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); // Naya error state
  const [isProcessing, setIsProcessing] = useState(false);

  const isInvestor = user?.role === 'investor';

  const openAddFunds = () => { 
    setModalMode('add'); 
    setTargetName('Self - Wallet Top-up'); 
    setIsModalOpen(true); 
    setError(null);
  };
  const openSendFunds = () => { 
    setModalMode('send'); 
    setTargetName(''); 
    setIsModalOpen(true); 
    setError(null);
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    // Validation: Check if balance is enough
    if (modalMode === 'send' && val > balance) {
      setError("Insaaf karein! Aapka balance itna nahi hai.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const isAdding = modalMode === 'add';

    const newEntry: Transaction = {
      id: Date.now(),
      name: isAdding ? "Funds Deposited" : (targetName || "Payment Transfer"),
      amount: val,
      date: new Date().toLocaleDateString('en-GB'),
      type: isAdding ? 'in' : 'out' // Simplified logic
    };

    setTransactions(prev => [newEntry, ...prev]);
    setBalance(prev => isAdding ? prev + val : prev - val);
    
    setShowSuccess(true);
    setIsProcessing(false);
    setIsModalOpen(false);
    
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setTargetName('');
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-left relative font-sans">
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-10 right-10 bg-[#0f172a] text-white px-8 py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[999] flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500 border border-white/10">
          <div className="bg-green-500 p-1 rounded-full text-white">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-widest">Success</p>
            <p className="text-xs text-gray-400">Transaction has been confirmed.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isInvestor ? 'Investment Portfolio' : 'Business Treasury'}
          </h1>
          <p className="text-slate-400 text-sm font-medium">Manage your financial growth and transfers.</p>
        </div>
        <button onClick={openSendFunds} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-200">
          <ArrowUpRight size={20} /> {isInvestor ? 'Invest Now' : 'Send Funds'}
        </button>
      </div>

      {/* Balance Card - Ultra Premium Look */}
      <div className="bg-slate-900 text-white p-16 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] mb-12 relative overflow-hidden group border border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <p className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Live Balance</p>
          </div>
          <h2 className="text-7xl font-black tracking-tighter">
            <span className="text-blue-500 text-4xl mr-2 font-light">$</span>
            {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </h2>
        </div>
        
        {/* Decorative Plus for adding funds */}
        <div onClick={openAddFunds} className="absolute -top-10 -right-10 w-80 h-80 flex items-center justify-center cursor-pointer group/plus z-20">
          <Plus size={200} className="text-white opacity-[0.03] group-hover/plus:opacity-10 group-hover/plus:text-blue-400 transition-all duration-500 transform group-hover/plus:rotate-90 group-hover/plus:scale-110" />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3 font-black text-slate-800 uppercase tracking-widest text-xs">
            <History size={18} className="text-blue-600" /> Recent Activity
          </div>
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase">Auto-updated</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              {transactions.length > 0 ? (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-lg leading-tight">{t.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`p-8 text-right font-black text-2xl ${t.type === 'in' ? 'text-green-600' : 'text-slate-900'}`}>
                      {t.type === 'in' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-32 text-center">
                    <History size={48} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden p-10 animate-in zoom-in-95 duration-300">
            <form onSubmit={handleTransactionSubmit} className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-3xl text-slate-900 tracking-tight">
                  {modalMode === 'add' ? 'Top-up Wallet' : 'Transfer Funds'}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
                  <AlertCircle size={20} /> {error}
                </div>
              )}
              
              <div className="space-y-6">
                {modalMode === 'send' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Recipient Identity</label>
                    <input 
                      type="text" 
                      placeholder="Enter full name..." 
                      className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900" 
                      value={targetName} 
                      onChange={(e) => setTargetName(e.target.value)} 
                      required 
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-300">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full bg-slate-50 border-2 border-slate-50 p-6 pl-12 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white font-mono text-3xl font-black transition-all text-slate-900" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  modalMode === 'add' ? 'Confirm Deposit' : 'Authenticate Transfer'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;