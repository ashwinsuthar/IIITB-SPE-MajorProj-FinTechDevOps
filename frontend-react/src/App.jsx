import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const MARKET_API_URL = 'http://localhost:8086/api/market';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password || password.length < 5) {
      alert('Invalid password! Please enter at least 5 characters.');
      return;
    }
    localStorage.setItem('username', username || 'Trader01');
    localStorage.setItem('lastLogin', new Date().toLocaleString());
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans text-lg">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 backdrop-blur-sm bg-opacity-80">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Trading <span className="text-blue-500 text-3xl italic">Pro</span></h2>
          <p className="text-gray-400 mt-2 font-medium">Advanced Trading Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">Username</label>
            <input
              type="text"
              placeholder="Enter your handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700/50 text-white px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">Security Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700/50 text-white px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl transition-all font-bold text-xl shadow-xl shadow-blue-500/25 active:scale-[0.98]"
          >
            Authenticate & Enter
          </button>
        </form>
      </div>
    </div>
  );
}

function TradeHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-8 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Trade Execution History</h2>
            <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-semibold italic">Complete Audit Log</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors group">
            <svg className="w-8 h-8 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 bg-gray-800 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Ticker</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Execution Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500 font-medium italic text-lg">No trades executed in this session.</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="bg-gray-700/30 hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-5 rounded-l-2xl font-bold text-white text-lg">{order.ticker}</td>
                    <td className={`px-6 py-5 font-black uppercase italic ${order.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{order.type}</td>
                    <td className="px-6 py-5 font-semibold text-gray-300">{order.quantity}</td>
                    <td className="px-6 py-5 font-mono text-white">${order.price?.toFixed(2)}</td>
                    <td className="px-6 py-5 rounded-r-2xl font-bold text-gray-200">${(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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

function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(15000);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [username] = useState(localStorage.getItem('username') || 'Trader');
  const [lastLogin] = useState(localStorage.getItem('lastLogin') || new Date().toLocaleString());

  const dataPointsRef = useRef([]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`);
      setPortfolioValue(response.data.balance || 15000);
      setOrderCount(response.data.orderCount || 0);
    } catch (err) { console.error('Error fetching portfolio:', err); }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (err) { console.error('Error fetching orders:', err); }
  };

  const updateMarketData = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/price/${ticker}`);
      const newPoint = {
        name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: response.data.price
      };

      setCurrentPrice(response.data.price);

      dataPointsRef.current = [...dataPointsRef.current, newPoint].slice(-20);
      setData([...dataPointsRef.current]);
    } catch (err) { console.error('Error fetching market data:', err); }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/history/${ticker}`);
      const historyData = response.data.map(point => ({
        name: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: point.price
      }));
      dataPointsRef.current = historyData;
      setData(historyData);
      if (historyData.length > 0) {
        setCurrentPrice(historyData[historyData.length - 1].price);
      }
    } catch (err) { console.error('Error fetching history:', err); }
  };

  const handleTrade = async (type) => {
    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: 10,
        price: currentPrice,
        type: type
      });
      fetchPortfolio();
      fetchOrders();
    } catch (err) { alert(`Error placing ${type} order.`); }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchOrders();
    fetchHistory();
    const interval = setInterval(() => {
      updateMarketData();
      fetchPortfolio();
    }, 2000);
    return () => clearInterval(interval);
  }, [ticker]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-6 font-sans selection:bg-blue-500/30">
      <header className="mb-10 p-8 bg-gray-800/40 border border-gray-700/50 rounded-3xl flex justify-between items-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-black text-white tracking-tight">Institutional Terminal</h1>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/30">PRO</span>
          </div>
          <p className="text-gray-400 font-medium text-lg italic">Strategic Portfolio Management & Real-time Execution</p>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-right hidden sm:block">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 italic">Operator Context</p>
            <p className="text-white font-black text-xl">{username}</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase mt-1">Logged: {lastLogin}</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-2xl transition-all font-bold tracking-tight active:scale-95 shadow-lg shadow-red-500/5"
          >
            Terminate Session
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-[1800px] mx-auto">
        <section className="col-span-1 xl:col-span-3 bg-gray-800/60 p-10 rounded-[2.5rem] shadow-2xl border border-gray-700/60 relative group backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-6 md:space-y-0">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Live Market Intake</h2>
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-black text-green-400 uppercase tracking-widest">Active Stream</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-4xl font-mono group">
                <span className="text-gray-500 font-bold tracking-tight">SPOT PRICE:</span>
                <span className="text-blue-400 font-black animate-pulse">${currentPrice?.toFixed(2)}</span>
                <span className="text-gray-600 text-sm font-black uppercase tracking-widest ml-4 bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-700 italic border-dashed group-hover:border-blue-500/50 transition-all">{ticker} FEED</span>
              </div>
            </div>
            <div className="w-full md:w-auto relative">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2 text-right italic">Instrument Selector</p>
              <select
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full md:w-80 bg-gray-900 text-white px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700 transition-all font-bold appearance-none cursor-pointer shadow-inner pr-12 text-lg hover:border-gray-500"
              >
                <optgroup label="PRIMARY MARKETS (US)" className="text-xs font-black bg-gray-900 text-gray-500">
                  <option value="AAPL">AAPL - Apple Inc.</option>
                  <option value="MSFT">MSFT - Microsoft Corp.</option>
                  <option value="GOOGL">GOOGL - Alphabet Inc.</option>
                  <option value="DIS">DIS - The Walt Disney Co.</option>
                  <option value="TSLA">TSLA - Tesla Inc.</option>
                  <option value="NVDA">NVDA - NVIDIA Corp.</option>
                </optgroup>
                <optgroup label="EMERGING MARKETS (IN)" className="text-xs font-black bg-gray-900 text-gray-500">
                  <option value="RELIANCE.NS">RELIANCE.NS - Reliance Industries</option>
                  <option value="TCS.NS">TCS.NS - Tata Consultancy Services</option>
                  <option value="INFY.NS">INFY.NS - Infosys Ltd.</option>
                </optgroup>
              </select>
              <div className="absolute right-4 bottom-5 pointer-events-none text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="h-[450px] w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickMargin={15} axisLine={false} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} domain={['auto', 'auto']} tickMargin={15} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
                <Line type="step" dataKey="price" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 10, strokeWidth: 0, fill: '#60a5fa' }} animationDuration={400} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-gray-800/80 p-10 rounded-[2.5rem] shadow-2xl border border-gray-700/60 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Capital Overview</h2>
              <div className="p-2 bg-gray-900/50 rounded-xl border border-gray-700">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
            </div>

            <div className="space-y-2 mb-10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 italic leading-none">Net Liquid Balance</p>
              <div className="text-5xl font-black text-green-400 tracking-tighter drop-shadow-lg leading-tight">
                <span className="text-3xl mr-1">$</span>{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-3xl p-6 border border-gray-700/50 space-y-6">
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Trade Volume</p>
                  <p className="text-2xl font-black text-white italic">{orderCount} <span className="text-gray-600 text-sm">PROCS</span></p>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 italic"
                >
                  History
                </button>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" style={{ width: `${Math.min(orderCount * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <button
              onClick={() => handleTrade('BUY')}
              className="group relative w-full overflow-hidden bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl transition-all font-black text-2xl tracking-tight shadow-xl shadow-blue-500/20 active:scale-95 italic"
            >
              <span className="relative z-10">Execute BUY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="w-full bg-red-600/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/30 hover:border-red-500 py-6 rounded-3xl transition-all font-black text-2xl tracking-tight active:scale-95 italic shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
            >
              Execute SELL
            </button>
          </div>
        </section>
      </main>

      <TradeHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} orders={orders} />
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  if (path === '/login') {
    return <Login />;
  }
  return <Dashboard />;
}

export default App;
