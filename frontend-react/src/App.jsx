import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api';
const MARKET_API_URL = 'http://localhost:8000/api';

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
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-4 font-sans text-lg selection:bg-blue-500/30">
      <div className="bg-[#0a0d14] p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/5 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Trading <span className="text-blue-500 text-3xl italic">Pro</span></h2>
          <p className="text-gray-500 mt-2 font-medium italic">Advanced Market Intelligence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Operator ID</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl transition-all font-black text-xl shadow-2xl shadow-blue-600/20 active:scale-[0.98] mt-4 italic tracking-tight"
          >
            CONFIRM IDENTITY
          </button>
        </form>
      </div>
    </div>
  );
}

function TradeHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#05070a]/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[2.5rem] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic">Trading Audit Log</h2>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em] font-black italic">Verified Execution Records Feed</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group active:scale-90">
            <svg className="w-8 h-8 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Instrument</th>
                <th className="px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Action</th>
                <th className="px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Units</th>
                <th className="px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Entry Price</th>
                <th className="px-6 py-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic text-right">Execution Value</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-32 text-gray-700 font-black italic text-2xl tracking-tight opacity-50">AUDIT LOG EMPTY. EXECUTE TRADES TO INITIALIZE.</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="bg-white/[0.03] hover:bg-white/[0.06] transition-all group rounded-2xl">
                    <td className="px-6 py-6 rounded-l-2xl font-black text-white text-xl tracking-tighter">{order.ticker}</td>
                    <td className={`px-6 py-6 font-black uppercase italic tracking-widest ${order.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{order.type}</td>
                    <td className="px-6 py-6 font-black text-gray-400 font-mono">{order.quantity}</td>
                    <td className="px-6 py-6 font-mono text-white font-bold">${order.price?.toFixed(2)}</td>
                    <td className="px-6 py-6 rounded-r-2xl font-black text-gray-300 text-right font-mono tracking-tight">${(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [period, setPeriod] = useState('1d');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [username] = useState(localStorage.getItem('username') || 'Trader');
  const [lastLogin] = useState(localStorage.getItem('lastLogin') || new Date().toLocaleString());

  const dataPointsRef = useRef([]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio/summary`);
      setPortfolioValue(response.data.totalValue || 0);
      setOrderCount(response.data.orderCount || 0);
      
      // Calculate holdings for current ticker
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`);
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
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data.reverse());
    } catch (err) { console.error('Error fetching orders:', err); }
  };

  const updateMarketData = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/predict/price/${ticker}`);
      if (response.data.error) return;
      
      const newPoint = {
        name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: response.data.price
      };

      setCurrentPrice(response.data.price);
      
      if (period === '1d') {
          dataPointsRef.current = [...dataPointsRef.current, newPoint].slice(-50);
          setData([...dataPointsRef.current]);
      }
    } catch (err) { console.error('Error fetching market data:', err); }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/predict/history/${ticker}?period=${period}`);
      if (response.data.error) return;
      
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
    } catch (err) { console.error('Error fetching history:', err); }
  };

  const handleTrade = async (type) => {
    if (quantity <= 0) {
        alert("Execution failed: Quantity must be greater than zero.");
        return;
    }
    
    const confirmMsg = `EXECUTIUON ALERT: Confirm ${type} of ${quantity} units of ${ticker} @ $${currentPrice.toFixed(2)}?\nTotal Execution Value: $${(quantity * currentPrice).toLocaleString()}`;
    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: parseInt(quantity),
        price: currentPrice,
        type: type
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
    }, 5000);
    return () => clearInterval(interval);
  }, [ticker, period]);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans selection:bg-blue-500/30">
      <header className="p-8 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-[60]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-black tracking-tighter text-white">Institutional Terminal</h1>
            <span className="bg-blue-600/20 text-blue-500 text-xs font-black px-3 py-1 rounded-full border border-blue-500/30">v2.5 ALPHA</span>
          </div>
          <p className="text-gray-500 font-medium text-lg italic mt-1">Real-time Global Market Intelligence & Cloud Execution</p>
        </div>
        <div className="flex items-center space-x-10">
          <div className="text-right hidden sm:block">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1 italic opacity-50">Authenticated Operator</p>
            <p className="text-white font-black text-2xl tracking-tighter">{username}</p>
            <p className="text-gray-600 text-[10px] font-black uppercase mt-1">L_LOG: {lastLogin}</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-red-500/0 hover:shadow-red-500/20"
          >
            END SESSION
          </button>
        </div>
      </header>

      <main className="p-10 grid grid-cols-1 xl:grid-cols-3 gap-10 max-w-[1700px] mx-auto">
        <section className="xl:col-span-2 bg-[#0a0d14] p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden group backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl font-black text-white tracking-tighter italic">Market Intake</h2>
                <div className="flex items-center space-x-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">Live Analytics</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-5xl font-black text-blue-400 tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] font-mono">${currentPrice?.toFixed(2)}</span>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-500 text-sm font-black uppercase tracking-[0.2em]">{ticker}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                {['1D', '5D', '1M', '1Y'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p.toLowerCase())}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${period === p.toLowerCase() ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="relative group/select w-full md:w-[320px]">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-2 text-right italic opacity-50">Select Asset Class</p>
                <select
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="bg-black/60 text-white px-8 py-5 rounded-[1.5rem] outline-none border border-white/5 transition-all font-black appearance-none cursor-pointer w-full text-xl hover:border-blue-500/50 shadow-2xl tracking-tighter"
                >
                  <optgroup label="EQUITIES - NASDAQ" className="bg-[#0a0d14] text-gray-500 font-black uppercase tracking-widest text-[10px] py-4">
                    <option value="AAPL">Apple Inc. (AAPL)</option>
                    <option value="MSFT">Microsoft Corp. (MSFT)</option>
                    <option value="GOOGL">Alphabet Inc. (GOOGL)</option>
                    <option value="AMZN">Amazon.com (AMZN)</option>
                    <option value="TSLA">Tesla Inc. (TSLA)</option>
                    <option value="NVDA">NVIDIA Corp. (NVDA)</option>
                    <option value="DIS">The Walt Disney Co. (DIS)</option>
                  </optgroup>
                  <optgroup label="EQUITIES - NSE" className="bg-[#0a0d14] text-gray-500 font-black uppercase tracking-widest text-[10px] py-4">
                    <option value="RELIANCE.NS">Reliance Industries Ltd.</option>
                  </optgroup>
                </select>
                <div className="absolute right-6 bottom-6 pointer-events-none text-blue-500/50 transition-colors group-hover/select:text-blue-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[480px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" stroke="#ffffff03" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickMargin={20} axisLine={false} tickLine={false} fontStyle="italic" fontWeight="bold" />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: '#05070a', border: '1px solid #ffffff08', borderRadius: '24px', boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8)', padding: '20px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: '900', fontSize: '20px', letterSpacing: '-0.05em' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '10px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'PRICE']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1500} 
                  activeDot={{ r: 12, fill: '#3b82f6', stroke: '#0a0d14', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-[#0a0d14] p-12 rounded-[3.5rem] shadow-2xl border border-white/5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-[100px]"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase opacity-80">Execution Center</h2>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/30 transition-colors">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1 italic">Total Account Balance</p>
              <div className="text-6xl font-black text-green-400 tracking-tighter drop-shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                <span className="text-3xl mr-1 opacity-50">$</span>{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white/[0.03] rounded-[2rem] p-8 border border-white/10">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic mb-2">Inventory Status</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter">{holdings} <span className="text-blue-500 text-sm font-black uppercase tracking-widest opacity-80">{ticker} Units</span></p>
                        </div>
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 active:scale-95 italic"
                        >
                            History
                        </button>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" style={{ width: `${Math.min((holdings / 100) * 100, 100)}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 space-y-6">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic mb-2">Order Configuration</p>
                    <div className="flex items-center justify-between">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl hover:bg-white/10 transition-colors shadow-2xl active:scale-90">-</button>
                        <div className="flex flex-col items-center">
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="w-24 bg-transparent text-center text-5xl font-black focus:outline-none tracking-tighter"
                            />
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Quantity</span>
                        </div>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl hover:bg-white/10 transition-colors shadow-2xl active:scale-90">+</button>
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-12 space-y-5 relative z-10">
            <button
              onClick={() => handleTrade('BUY')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-7 rounded-[1.5rem] transition-all font-black text-2xl tracking-tighter shadow-[0_20px_50px_-15px_rgba(59,130,246,0.5)] active:scale-95 italic group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              TRANSMIT BUY ORDER
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="w-full bg-transparent hover:bg-red-500/10 text-red-500 border-2 border-red-500/20 py-7 rounded-[1.5rem] transition-all font-black text-2xl tracking-tighter active:scale-95 italic"
            >
              TRANSMIT SELL ORDER
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
  if (path === '/login' || path === '/') {
    return <Login />;
  }
  return <Dashboard />;
}

export default App;
