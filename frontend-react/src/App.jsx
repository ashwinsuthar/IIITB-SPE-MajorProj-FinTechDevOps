import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const MARKET_API_URL = 'http://localhost:8000/api';

const STOCKS = [
  // USA (Fortune 200)
  { value: "AAPL", label: "Apple Inc." }, { value: "MSFT", label: "Microsoft Corp." },
  { value: "GOOGL", label: "Alphabet Inc." }, { value: "AMZN", label: "Amazon.com" },
  { value: "NVDA", label: "NVIDIA Corp." }, { value: "META", label: "Meta Platforms" },
  { value: "TSLA", label: "Tesla Inc." }, { value: "BRK-B", label: "Berkshire Hathaway" },
  { value: "UNH", label: "UnitedHealth Group" }, { value: "LLY", label: "Eli Lilly and Co" },
  { value: "JPM", label: "JPMorgan Chase" }, { value: "V", label: "Visa Inc." },
  { value: "XOM", label: "Exxon Mobil" }, { value: "MA", label: "Mastercard Inc." },
  { value: "AVGO", label: "Broadcom Inc." }, { value: "HD", label: "Home Depot" },
  { value: "PG", label: "Procter & Gamble" }, { value: "COST", label: "Costco Wholesale" },
  { value: "JNJ", label: "Johnson & Johnson" }, { value: "ABBV", label: "AbbVie Inc." },
  { value: "MRK", label: "Merck & Co." }, { value: "CRM", label: "Salesforce Inc." },
  { value: "ADBE", label: "Adobe Inc." }, { value: "AMD", label: "AMD Inc." },
  { value: "CVX", label: "Chevron Corp." }, { value: "NFLX", label: "Netflix Inc." },
  { value: "PEP", label: "PepsiCo Inc." }, { value: "KO", label: "Coca-Cola Co." },
  { value: "TMO", label: "Thermo Fisher" }, { value: "WMT", label: "Walmart Inc." },
  { value: "MCD", label: "McDonald's Corp." }, { value: "DIS", label: "Walt Disney" },
  { value: "CSCO", label: "Cisco Systems" }, { value: "TMUS", label: "T-Mobile US" },
  { value: "ABT", label: "Abbott Labs" }, { value: "BAC", label: "Bank of America" },
  { value: "INTC", label: "Intel Corp." }, { value: "PFE", label: "Pfizer Inc." },
  { value: "QCOM", label: "Qualcomm Inc." }, { value: "ORCL", label: "Oracle Corp." },
  { value: "LIN", label: "Linde plc" }, { value: "VZ", label: "Verizon" },
  { value: "CMCSA", label: "Comcast" }, { value: "INTU", label: "Intuit Inc." },
  { value: "AMAT", label: "Applied Materials" }, { value: "TXN", label: "Texas Instruments" },
  { value: "BKNG", label: "Booking Holdings" }, { value: "UNP", label: "Union Pacific" },
  { value: "LOW", label: "Lowe's Companies" }, { value: "SBUX", label: "Starbucks" },
  // INDIA (Nifty 50)
  { value: "RELIANCE.NS", label: "Reliance Industries" }, { value: "TCS.NS", label: "Tata Consultancy Services" },
  { value: "HDFCBANK.NS", label: "HDFC Bank Ltd." }, { value: "BHARTIARTL.NS", label: "Bharti Airtel Ltd." },
  { value: "ICICIBANK.NS", label: "ICICI Bank Ltd." }, { value: "INFY.NS", label: "Infosys Limited" },
  { value: "SBIN.NS", label: "State Bank of India" }, { value: "LIC.NS", label: "LIC of India" },
  { value: "HUL.NS", label: "Hindustan Unilever" }, { value: "ITC.NS", label: "ITC Limited" },
  { value: "KOTAKBANK.NS", label: "Kotak Mahindra Bank" }, { value: "AXISBANK.NS", label: "Axis Bank Ltd." },
  { value: "LT.NS", label: "Larsen & Toubro Ltd." }, { value: "SUNPHARMA.NS", label: "Sun Pharma" },
  { value: "BAJFINANCE.NS", label: "Bajaj Finance" }, { value: "MARUTI.NS", label: "Maruti Suzuki" },
  { value: "TITAN.NS", label: "Titan Company" }, { value: "ADANIENT.NS", label: "Adani Enterprises" },
  { value: "ADANIPORTS.NS", label: "Adani Ports" }, { value: "TATAMOTORS.NS", label: "Tata Motors" },
  { value: "COALINDIA.NS", label: "Coal India" }, { value: "NTPC.NS", label: "NTPC Limited" },
  { value: "ULTRACEMCO.NS", label: "UltraTech Cement" }, { value: "ONGC.NS", label: "ONGC" },
  { value: "ASIANPAINT.NS", label: "Asian Paints" }, { value: "GRASIM.NS", label: "Grasim Industries" },
  { value: "JSWSTEEL.NS", label: "JSW Steel" }, { value: "NESTLEIND.NS", label: "Nestle India" },
  { value: "M&M.NS", label: "M&M Limited" }, { value: "INDUSINDBK.NS", label: "IndusInd Bank" },
  { value: "POWERGRID.NS", label: "Power Grid Corp." }, { value: "BPCL.NS", label: "BPCL" },
  { value: "HCLTECH.NS", label: "HCL Technologies" }, { value: "DRREDDY.NS", label: "Dr Reddy's Labs" },
  { value: "WIPRO.NS", label: "Wipro Limited" }, { value: "APOLLOHOSP.NS", label: "Apollo Hospitals" },
  { value: "SBILIFE.NS", label: "SBI Life Insurance" }, { value: "BAJAJ-AUTO.NS", label: "Bajaj Auto" },
  { value: "HEROMOTOCO.NS", label: "Hero MotoCorp" }, { value: "EICHERMOT.NS", label: "Eicher Motors" },
  { value: "BRITANNIA.NS", label: "Britannia Industries" }, { value: "TATACONSUM.NS", label: "Tata Consumer Products" },
  { value: "CIPLA.NS", label: "Cipla Limited" }, { value: "DIVISLAB.NS", label: "Divi's Laboratories" },
  { value: "HDFCLIFE.NS", label: "HDFC Life" }, { value: "SHRIRAMFIN.NS", label: "Shriram Finance" },
  { value: "TECHM.NS", label: "Tech Mahindra" }, { value: "BEL.NS", label: "Bharat Electronics" },
  { value: "HAL.NS", label: "Hindustan Aeronautics" }, { value: "TRENT.NS", label: "Trent Limited" }
];

function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/^[a-zA-Z0-9]+$/.test(pass)) return "Password must be alphanumeric only (no special characters)";
    return null;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (activeTab === 'register') {
      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        return;
      }
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
        setSuccess('Registration successful! Please login.');
        setActiveTab('login');
        setPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('lastLogin', new Date().toLocaleString());
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <div className="bg-[#0a0d14] p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/5 backdrop-blur-3xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">Trading <span className="text-blue-500 italic">Pro</span></h2>
          <p className="text-gray-500 mt-2 font-bold italic text-sm uppercase tracking-widest">Institutional Access Portal</p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5 shadow-inner">
            <button 
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-600 hover:text-white'}`}
            >
                Login
            </button>
            <button 
                onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-600 hover:text-white'}`}
            >
                Register
            </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold text-center animate-pulse">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm font-bold text-center">{success}</div>}

        <form onSubmit={handleAction} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 italic font-sans">Operator Identifier</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold text-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 italic font-sans">Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold text-lg"
              required
            />
            {activeTab === 'register' && (
                <p className="text-[10px] text-gray-600 font-bold mt-2 px-2 italic uppercase tracking-tighter">Min 6 chars. Alphanumeric only. No special chars.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl transition-all font-black text-xl shadow-2xl shadow-blue-600/30 active:scale-[0.98] mt-4 italic tracking-widest uppercase"
          >
            {activeTab === 'login' ? 'Authorize Session' : 'Create Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AssetSearchModal({ isOpen, onClose, currentTicker, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  const filteredStocks = STOCKS.filter(stock => 
    stock.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#05070a]/98 backdrop-blur-3xl flex items-center justify-center z-[200] p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[4rem] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_150px_rgba(59,130,246,0.15)]">
        <div className="p-12 border-b border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-6xl font-black text-white tracking-tighter italic">Asset Discovery</h2>
                    <p className="text-xl text-gray-500 mt-4 uppercase tracking-[0.4em] font-black italic opacity-60">Global Markets (NSE, BSE, NYSE, NASDAQ)</p>
                </div>
                <button onClick={onClose} className="p-5 hover:bg-white/10 rounded-3xl transition-all border border-transparent hover:border-white/10 active:scale-90">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div className="relative group">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                    <svg className="w-10 h-10 text-blue-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Enter Stock Ticker or Company Name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full bg-black/50 text-white pl-24 pr-12 py-8 rounded-[2.5rem] outline-none border-2 border-white/5 focus:border-blue-500/50 transition-all font-black text-4xl placeholder:text-gray-800 shadow-inner"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-blue-600/20 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <div 
                key={stock.value}
                onClick={() => { onSelect(stock.value); onClose(); setSearchTerm(''); }}
                className={`p-8 rounded-[2.5rem] transition-all cursor-pointer flex items-center space-x-6 border group/item ${currentTicker === stock.value ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover/item:scale-110 ${currentTicker === stock.value ? 'bg-blue-600 text-white' : 'bg-black text-blue-500'}`}>
                    {stock.value.substring(0, 2)}
                </div>
                <div className="flex-1 truncate">
                    <p className="text-2xl font-black text-white group-hover/item:text-blue-400 transition-colors truncate tracking-tight">{stock.label}</p>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1 group-hover/item:text-gray-400">{stock.value}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredStocks.length === 0 && (
              <div className="py-40 text-center">
                  <p className="text-gray-700 font-black italic text-5xl tracking-tighter opacity-40 uppercase">NO ASSETS FOUND</p>
                  <p className="text-gray-800 font-black text-sm mt-6 uppercase tracking-[0.5em]">Refine your search parameters</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TradeHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#05070a]/95 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[3rem] w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,0,0,0.9)] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Trade Execution Logs</h2>
            <p className="text-xl text-gray-500 mt-3 uppercase tracking-[0.4em] font-black italic opacity-60">Immutable Audit History</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group active:scale-90">
            <svg className="w-10 h-10 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <table className="w-full text-left border-separate border-spacing-y-6">
            <thead>
              <tr>
                <th className="px-8 py-2 text-base font-black text-gray-500 uppercase tracking-[0.3em] italic">Ticker</th>
                <th className="px-8 py-2 text-base font-black text-gray-500 uppercase tracking-[0.3em] italic">Action</th>
                <th className="px-8 py-2 text-base font-black text-gray-500 uppercase tracking-[0.3em] italic">Quantity</th>
                <th className="px-8 py-2 text-base font-black text-gray-500 uppercase tracking-[0.3em] italic">Settle Price</th>
                <th className="px-8 py-2 text-base font-black text-gray-500 uppercase tracking-[0.3em] italic text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-40 text-gray-700 font-black italic text-4xl tracking-tight opacity-40 uppercase">NO RECORDS FOUND.</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="bg-white/[0.04] hover:bg-white/[0.08] transition-all group rounded-3xl">
                    <td className="px-8 py-8 rounded-l-3xl font-black text-white text-2xl tracking-tighter">{order.ticker}</td>
                    <td className={`px-8 py-8 font-black uppercase italic tracking-widest text-lg ${order.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{order.type}</td>
                    <td className="px-8 py-8 font-black text-gray-400 font-mono text-xl">{order.quantity}</td>
                    <td className="px-8 py-8 font-mono text-white font-bold text-xl tracking-tighter">${order.price?.toFixed(2)}</td>
                    <td className="px-8 py-8 rounded-r-3xl font-black text-gray-300 text-right font-mono text-2xl tracking-tight">${(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HoldingsModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  const holdingsMap = orders.reduce((acc, order) => {
    if (!acc[order.ticker]) acc[order.ticker] = 0;
    acc[order.ticker] += order.type === 'BUY' ? order.quantity : -order.quantity;
    return acc;
  }, {});

  const holdingsList = Object.entries(holdingsMap)
    .filter(([_, qty]) => qty > 0)
    .map(([ticker, qty]) => ({ ticker, quantity: qty }));

  return (
    <div className="fixed inset-0 bg-[#05070a]/95 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[4rem] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Current Holdings</h2>
            <p className="text-xl text-gray-500 mt-3 uppercase tracking-[0.4em] font-black italic opacity-60">Real-time Inventory</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group active:scale-90">
            <svg className="w-10 h-10 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          {holdingsList.length === 0 ? (
            <div className="py-40 text-center text-gray-700 font-black italic text-4xl tracking-tight opacity-40 uppercase">NO ACTIVE POSITIONS.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {holdingsList.map((holding) => (
                <div key={holding.ticker} className="bg-white/[0.04] p-8 rounded-3xl border border-white/5 flex justify-between items-center hover:bg-white/[0.08] transition-all">
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Asset Ticker</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{holding.ticker}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Net Units</p>
                    <p className="text-4xl font-black text-blue-500 italic tracking-tighter">{holding.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onConfirm, onCancel, data }) {
  if (!isOpen) return null;
  const { type, quantity, ticker, price } = data;
  const totalValue = (quantity * price).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 bg-[#05070a]/98 backdrop-blur-3xl flex items-center justify-center z-[300] p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[3rem] w-full max-w-lg p-12 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${type === 'BUY' ? 'blue' : 'red'}-500 to-transparent`}></div>
        <div className="text-center space-y-8">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${type === 'BUY' ? 'bg-blue-600/20' : 'bg-red-600/20'}`}>
            <svg className={`w-12 h-12 ${type === 'BUY' ? 'text-blue-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-2">Execute Order?</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Awaiting Operator Confirmation</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Operation Type</span>
              <span className={`text-xl font-black italic ${type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Asset Ticker</span>
              <span className="text-xl font-black text-white">{ticker}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Intensity</span>
              <span className="text-xl font-black text-white">{quantity} Units</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Est. Impact</span>
              <span className="text-3xl font-black text-green-400 font-mono tracking-tighter">${totalValue}</span>
            </div>
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={onCancel}
              className="flex-1 py-5 rounded-2xl border border-white/10 text-gray-500 font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Abort
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl ${type === 'BUY' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'}`}
            >
              Commit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [period, setPeriod] = useState('1d');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHoldingsOpen, setIsHoldingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ isOpen: false, type: '', quantity: 0, ticker: '', price: 0 });
  const [loading, setLoading] = useState(true);
  
  const [username] = useState(localStorage.getItem('username') || 'Trader');
  const [lastLogin] = useState(localStorage.getItem('lastLogin') || new Date().toLocaleString());

  const dataPointsRef = useRef([]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`, { params: { username } });
      setPortfolioValue(response.data.balance || 0);
      setOrderCount(response.data.orderCount || 0);
      
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`, { params: { username } });
      const allOrders = ordersRes.data;
      const tickerHoldings = allOrders.reduce((acc, order) => {
        if (order.ticker === ticker) {
          return order.type === 'BUY' ? acc + order.quantity : acc - order.quantity;
        }
        return acc;
      }, 0);
      setHoldings(tickerHoldings);
    } catch (err) { console.error('Error fetching portfolio:', err); }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, { params: { username } });
      setOrders(response.data.reverse());
    } catch (err) { console.error('Error fetching orders:', err); }
  };

  const updateMarketData = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/predict/price/${ticker}`);
      if (response.data && response.data.price) {
        const price = response.data.price;
        setCurrentPrice(price);
        
        if (period === '1d') {
            const newPoint = {
                name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: price
            };
            dataPointsRef.current = [...dataPointsRef.current, newPoint].slice(-100);
            setData([...dataPointsRef.current]);
        }
      }
    } catch (err) { console.error('Error updating market data:', err); }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const p = period === '1m' ? '1mo' : period;
      const response = await axios.get(`${MARKET_API_URL}/predict/history/${ticker}?period=${p}`);
      if (response.data && response.data.history) {
        const historyData = response.data.history.map(point => ({
          name: (period === '1d' || period === '5d') 
              ? new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(point.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          price: point.price
        }));
        dataPointsRef.current = historyData;
        setData(historyData);
        if (historyData.length > 0) {
          setCurrentPrice(historyData[historyData.length - 1].price);
        }
      }
    } catch (err) { console.error('Error fetching history:', err); }
    setLoading(false);
  };

  const handleTrade = (type) => {
    if (quantity <= 0) {
        alert("Execution failed: Quantity must be greater than zero.");
        return;
    }
    setConfirmationData({ isOpen: true, type, quantity: parseInt(quantity), ticker, price: currentPrice });
  };

  const executeTrade = async () => {
    const { type, quantity, ticker, price } = confirmationData;
    setConfirmationData({ ...confirmationData, isOpen: false });
    
    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: parseInt(quantity),
        price: price,
        type: type,
        username: username
      });
      fetchPortfolio();
      fetchOrders();
    } catch (err) { alert(`Critical Error: ${type} order failed at execution layer.`); }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchOrders();
    fetchHistory();
    const interval = setInterval(() => {
      if (period === '1d') updateMarketData();
      fetchPortfolio();
    }, 3000);
    return () => clearInterval(interval);
  }, [ticker, period, username]);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="p-10 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-[60]">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-5xl font-black tracking-tighter text-white">Institutional Terminal</h1>
            <span className="bg-blue-600/30 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/40 tracking-widest uppercase">v2.5 PRO</span>
          </div>
          <p className="text-gray-500 font-bold text-xl italic mt-2 opacity-80">Real-time Global Market Intelligence & Enterprise Execution</p>
        </div>
        <div className="flex items-center space-x-12">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500 font-black uppercase tracking-[0.5em] mb-1 italic opacity-60">Operator Rank: High Frequency</p>
            <p className="text-white font-black text-4xl tracking-tighter uppercase">{username}</p>
            <p className="text-gray-600 text-xs font-black uppercase mt-2 tracking-widest font-mono opacity-80">L_LOG: {lastLogin}</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 hover:border-red-500 px-10 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-2xl shadow-red-500/0 hover:shadow-red-500/30"
          >
            TERMINATE SESSION
          </button>
        </div>
      </header>

      <main className="p-12 grid grid-cols-1 xl:grid-cols-3 gap-12 max-w-[1900px] mx-auto">
        <section className="xl:col-span-2 bg-[#0a0d14] p-12 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden group backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <h2 className="text-5xl font-black text-white tracking-tighter italic">Market Pulse</h2>
                <div className="flex items-center space-x-3 px-5 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-black text-green-400 uppercase tracking-[0.2em] leading-none">Stream Active</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-7xl font-black text-blue-400 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] font-mono">
                    {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'FETCHING...'}
                </span>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-gray-400 text-2xl font-black uppercase tracking-[0.3em] font-mono">{ticker}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-10 w-full md:w-auto">
              <div className="flex bg-black/60 p-2 rounded-2xl border border-white/10 shadow-inner">
                {['1D', '5D', '1M', '1Y'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p.toLowerCase())}
                    className={`px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 ${period === p.toLowerCase() ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              
              <div className="relative group/select w-full md:w-[400px]">
                <p className="text-2xl text-gray-500 font-black uppercase tracking-[0.4em] mb-4 text-right italic font-sans">Search Asset</p>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-black/80 text-white px-10 py-6 rounded-[2rem] border border-white/10 transition-all font-black cursor-pointer w-full text-3xl hover:border-blue-500 shadow-2xl tracking-tighter flex justify-between items-center group/btn active:scale-95"
                >
                  <span className="truncate">{STOCKS.find(s => s.value === ticker)?.label || "Discover Assets"}</span>
                  <svg className="w-10 h-10 text-blue-500 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="h-[520px] w-full mt-8 relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-3xl">
                    <p className="text-blue-500 font-black text-4xl animate-pulse italic tracking-widest">LOADING HISTORICAL DATA...</p>
                </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="12 12" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickMargin={15} axisLine={false} tickLine={false} fontStyle="italic" fontWeight="900" />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#0a0d14', border: '1px solid #ffffff10', borderRadius: '32px', boxShadow: '0 60px 120px -30px rgba(0, 0, 0, 0.9)', padding: '30px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: '900', fontSize: '28px', letterSpacing: '-0.07em' }}
                  labelStyle={{ color: '#6b7280', marginBottom: '15px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em' }}
                  formatter={(value) => [value ? `$${value.toFixed(2)}` : '$0.00', 'PRICE']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1000} 
                  activeDot={{ r: 14, fill: '#3b82f6', stroke: '#0a0d14', strokeWidth: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-[#0a0d14] p-12 rounded-[4rem] shadow-2xl border border-white/5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[120px]"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase opacity-90">Execution Engine</h2>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 transition-colors shadow-2xl">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
            </div>

            <div className="space-y-6 mb-16">
              <p className="text-xl font-black text-gray-500 uppercase tracking-[0.5em] ml-2 italic">Net Account Liquidity</p>
              <div className="text-7xl font-black text-green-400 tracking-tighter drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                <span className="text-4xl mr-2 opacity-60 font-mono">$</span>{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-10">
                <div className="bg-white/[0.03] rounded-[3rem] p-10 border border-white/10 shadow-2xl hover:bg-white/[0.05] transition-all group">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-xl font-black text-gray-600 uppercase tracking-[0.3em] italic mb-4">Inventory Profile</p>
                            <p className="text-5xl font-black text-white italic tracking-tighter">{holdings} <span className="text-blue-500 text-sm font-black uppercase tracking-widest opacity-90">{ticker} Units</span></p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsHoldingsOpen(true)}
                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.3em] border border-blue-500/20 active:scale-95 italic shadow-lg"
                            >
                                Holdings
                            </button>
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.3em] border border-white/10 active:scale-95 italic shadow-lg"
                            >
                                Log Audit
                            </button>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6] transition-all duration-1000" style={{ width: `${Math.min((holdings / 100) * 100, 100)}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 space-y-8 shadow-inner">
                    <p className="text-xl font-black text-gray-600 uppercase tracking-[0.4em] italic mb-6">Transmission Payload</p>
                    <div className="flex items-center justify-between">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-3xl hover:bg-white/20 transition-all shadow-2xl active:scale-90">-</button>
                        <div className="flex flex-col items-center">
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="w-32 bg-transparent text-center text-7xl font-black focus:outline-none tracking-tighter text-blue-400"
                            />
                            <span className="text-xs font-black text-gray-700 uppercase tracking-widest mt-2">Units</span>
                        </div>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-3xl hover:bg-white/20 transition-all shadow-2xl active:scale-90">+</button>
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-16 space-y-6 relative z-10">
            <button
              onClick={() => handleTrade('BUY')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-8 rounded-[2rem] transition-all font-black text-3xl tracking-tighter shadow-[0_30px_70px_-20px_rgba(59,130,246,0.6)] active:scale-95 italic group overflow-hidden uppercase"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Commit Buy Order
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="w-full bg-transparent hover:bg-red-500/10 text-red-500 border-2 border-red-500/20 py-8 rounded-[2rem] transition-all font-black text-3xl tracking-tighter active:scale-95 italic hover:border-red-500 uppercase"
            >
              Commit Sell Order
            </button>
          </div>
        </section>
      </main>

      <AssetSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        currentTicker={ticker} 
        onSelect={setTicker} 
      />
      <TradeHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} orders={orders} />
      <HoldingsModal isOpen={isHoldingsOpen} onClose={() => setIsHoldingsOpen(false)} orders={orders} />
      <ConfirmationModal 
        isOpen={confirmationData.isOpen} 
        onConfirm={executeTrade} 
        onCancel={() => setConfirmationData({ ...confirmationData, isOpen: false })} 
        data={confirmationData} 
      />
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  if (path === '/login' || path === '/') {
    return <Auth />;
  }
  return <Dashboard />;
}

export default App;
