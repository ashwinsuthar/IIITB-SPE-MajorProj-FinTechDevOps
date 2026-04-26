import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-4 font-sans text-xl selection:bg-blue-500/30">
      <div className="bg-[#0a0d14] p-12 rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/5 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Trading <span className="text-blue-500 text-4xl italic">Pro</span></h2>
          <p className="text-gray-400 mt-3 font-semibold italic text-lg">Institutional Terminal Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Operator Identifier</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 text-white px-8 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold text-xl"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Security Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 text-white px-8 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all placeholder:text-gray-700 font-bold text-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl transition-all font-black text-2xl shadow-2xl shadow-blue-600/30 active:scale-[0.98] mt-4 italic tracking-tighter"
          >
            AUTHORIZE SESSION
          </button>
        </form>
      </div>
    </div>
  );
}

function TradeHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#05070a]/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-[#0a0d14] border border-white/10 rounded-[3rem] w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,0,0,0.9)] relative">
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Trade Execution Logs</h2>
            <p className="text-xs text-gray-500 mt-3 uppercase tracking-[0.4em] font-black italic">Immutable Audit History</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group active:scale-90">
            <svg className="w-10 h-10 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <table className="w-full text-left border-separate border-spacing-y-6">
            <thead>
              <tr>
                <th className="px-8 py-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic">Ticker</th>
                <th className="px-8 py-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic">Action</th>
                <th className="px-8 py-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic">Quantity</th>
                <th className="px-8 py-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic">Settle Price</th>
                <th className="px-8 py-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em] italic text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-40 text-gray-700 font-black italic text-3xl tracking-tight opacity-40">NO RECORDS FOUND.</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="bg-white/[0.04] hover:bg-white/[0.08] transition-all group rounded-3xl">
                    <td className="px-8 py-8 rounded-l-3xl font-black text-white text-2xl tracking-tighter">{order.ticker}</td>
                    <td className={`px-8 py-8 font-black uppercase italic tracking-widest text-lg ${order.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{order.type}</td>
                    <td className="px-8 py-8 font-black text-gray-400 font-mono text-xl">{order.quantity}</td>
                    <td className="px-8 py-8 font-mono text-white font-bold text-xl">${order.price?.toFixed(2)}</td>
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
  const [loading, setLoading] = useState(true);
  
  const [username] = useState(localStorage.getItem('username') || 'Trader');
  const [lastLogin] = useState(localStorage.getItem('lastLogin') || new Date().toLocaleString());

  const dataPointsRef = useRef([]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`);
      setPortfolioValue(response.data.balance || 0);
      setOrderCount(response.data.orderCount || 0);
      
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
      const response = await axios.get(`${MARKET_API_URL}/predict/history/${ticker}?period=${period}`);
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
    }, 3000);
    return () => clearInterval(interval);
  }, [ticker, period]);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="p-10 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-[60]">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-5xl font-black tracking-tighter text-white">Institutional Terminal</h1>
            <span className="bg-blue-600/30 text-blue-400 text-sm font-black px-4 py-1.5 rounded-full border border-blue-500/40">v2.5 PRO</span>
          </div>
          <p className="text-gray-500 font-bold text-xl italic mt-2 opacity-80">Real-time Global Market Intelligence & Enterprise Execution</p>
        </div>
        <div className="flex items-center space-x-12">
          <div className="text-right hidden sm:block">
            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.5em] mb-1 italic opacity-40">Operator Rank: High Frequency</p>
            <p className="text-white font-black text-3xl tracking-tighter uppercase">{username}</p>
            <p className="text-gray-600 text-xs font-black uppercase mt-2 tracking-widest">L_LOG: {lastLogin}</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 hover:border-red-500 px-10 py-5 rounded-2xl transition-all font-black text-sm uppercase tracking-widest active:scale-95 shadow-2xl shadow-red-500/0 hover:shadow-red-500/30"
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
                    <span className="text-gray-400 text-lg font-black uppercase tracking-[0.3em] font-mono">{ticker}</span>
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
                <p className="text-xs text-gray-500 font-black uppercase tracking-[0.4em] mb-3 text-right italic opacity-50">Select Asset Class</p>
                <select
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="bg-black/80 text-white px-10 py-6 rounded-[2rem] outline-none border border-white/10 transition-all font-black appearance-none cursor-pointer w-full text-2xl hover:border-blue-500 shadow-2xl tracking-tighter"
                >
                  <optgroup label="EQUITIES - USA (FORTUNE 200)" className="bg-[#0a0d14] text-gray-500 font-black uppercase tracking-[0.2em] text-xs py-4">
                    <option value="AAPL">Apple Inc. (AAPL)</option>
                    <option value="MSFT">Microsoft Corp. (MSFT)</option>
                    <option value="GOOGL">Alphabet Inc. (GOOGL)</option>
                    <option value="AMZN">Amazon.com (AMZN)</option>
                    <option value="NVDA">NVIDIA Corp. (NVDA)</option>
                    <option value="META">Meta Platforms (META)</option>
                    <option value="TSLA">Tesla Inc. (TSLA)</option>
                    <option value="BRK-B">Berkshire Hathaway (BRK-B)</option>
                    <option value="UNH">UnitedHealth Group (UNH)</option>
                    <option value="LLY">Eli Lilly and Co (LLY)</option>
                    <option value="JPM">JPMorgan Chase (JPM)</option>
                    <option value="V">Visa Inc. (V)</option>
                    <option value="XOM">Exxon Mobil (XOM)</option>
                    <option value="MA">Mastercard Inc. (MA)</option>
                    <option value="AVGO">Broadcom Inc. (AVGO)</option>
                    <option value="HD">Home Depot (HD)</option>
                    <option value="PG">Procter & Gamble (PG)</option>
                    <option value="COST">Costco Wholesale (COST)</option>
                    <option value="JNJ">Johnson & Johnson (JNJ)</option>
                    <option value="ABBV">AbbVie Inc. (ABBV)</option>
                    <option value="MRK">Merck & Co. (MRK)</option>
                    <option value="CRM">Salesforce Inc. (CRM)</option>
                    <option value="ADBE">Adobe Inc. (ADBE)</option>
                    <option value="AMD">AMD Inc. (AMD)</option>
                    <option value="CVX">Chevron Corp. (CVX)</option>
                    <option value="NFLX">Netflix Inc. (NFLX)</option>
                    <option value="PEP">PepsiCo Inc. (PEP)</option>
                    <option value="KO">Coca-Cola Co. (KO)</option>
                    <option value="TMO">Thermo Fisher (TMO)</option>
                    <option value="WMT">Walmart Inc. (WMT)</option>
                    <option value="MCD">McDonald's Corp. (MCD)</option>
                    <option value="DIS">Walt Disney (DIS)</option>
                    <option value="CSCO">Cisco Systems (CSCO)</option>
                    <option value="TMUS">T-Mobile US (TMUS)</option>
                    <option value="ABT">Abbott Labs (ABT)</option>
                    <option value="BAC">Bank of America (BAC)</option>
                    <option value="INTC">Intel Corp. (INTC)</option>
                    <option value="PFE">Pfizer Inc. (PFE)</option>
                    <option value="QCOM">Qualcomm Inc. (QCOM)</option>
                    <option value="ORCL">Oracle Corp. (ORCL)</option>
                    <option value="LIN">Linde plc (LIN)</option>
                    <option value="VZ">Verizon (VZ)</option>
                    <option value="CMCSA">Comcast (CMCSA)</option>
                    <option value="INTU">Intuit Inc. (INTU)</option>
                    <option value="AMAT">Applied Materials (AMAT)</option>
                    <option value="TXN">Texas Instruments (TXN)</option>
                    <option value="BKNG">Booking Holdings (BKNG)</option>
                    <option value="UNP">Union Pacific (UNP)</option>
                    <option value="LOW">Lowe's Companies (LOW)</option>
                    <option value="SBUX">Starbucks (SBUX)</option>
                  </optgroup>
                  <optgroup label="EQUITIES - INDIA (NIFTY 50)" className="bg-[#0a0d14] text-gray-500 font-black uppercase tracking-[0.2em] text-xs py-4">
                    <option value="RELIANCE.NS">Reliance Industries</option>
                    <option value="TCS.NS">Tata Consultancy Services</option>
                    <option value="HDFCBANK.NS">HDFC Bank Ltd.</option>
                    <option value="BHARTIARTL.NS">Bharti Airtel Ltd.</option>
                    <option value="ICICIBANK.NS">ICICI Bank Ltd.</option>
                    <option value="INFY.NS">Infosys Limited</option>
                    <option value="SBIN.NS">State Bank of India</option>
                    <option value="LIC.NS">LIC of India</option>
                    <option value="HUL.NS">Hindustan Unilever</option>
                    <option value="ITC.NS">ITC Limited</option>
                    <option value="KOTAKBANK.NS">Kotak Mahindra Bank</option>
                    <option value="AXISBANK.NS">Axis Bank Ltd.</option>
                    <option value="LT.NS">Larsen & Toubro Ltd.</option>
                    <option value="SUNPHARMA.NS">Sun Pharma</option>
                    <option value="BAJFINANCE.NS">Bajaj Finance</option>
                    <option value="MARUTI.NS">Maruti Suzuki</option>
                    <option value="TITAN.NS">Titan Company</option>
                    <option value="ADANIENT.NS">Adani Enterprises</option>
                    <option value="ADANIPORTS.NS">Adani Ports</option>
                    <option value="TATAMOTORS.NS">Tata Motors</option>
                    <option value="COALINDIA.NS">Coal India</option>
                    <option value="NTPC.NS">NTPC Limited</option>
                    <option value="ULTRACEMCO.NS">UltraTech Cement</option>
                    <option value="ONGC.NS">ONGC</option>
                    <option value="ASIANPAINT.NS">Asian Paints</option>
                    <option value="GRASIM.NS">Grasim Industries</option>
                    <option value="JSWSTEEL.NS">JSW Steel</option>
                    <option value="NESTLEIND.NS">Nestle India</option>
                    <option value="M&M.NS">M&M Limited</option>
                    <option value="INDUSINDBK.NS">IndusInd Bank</option>
                    <option value="POWERGRID.NS">Power Grid Corp.</option>
                    <option value="BPCL.NS">BPCL</option>
                    <option value="HCLTECH.NS">HCL Technologies</option>
                    <option value="DRREDDY.NS">Dr Reddy's Labs</option>
                    <option value="WIPRO.NS">Wipro Limited</option>
                    <option value="APOLLOHOSP.NS">Apollo Hospitals</option>
                    <option value="SBILIFE.NS">SBI Life Insurance</option>
                    <option value="BAJAJ-AUTO.NS">Bajaj Auto</option>
                    <option value="HEROMOTOCO.NS">Hero MotoCorp</option>
                    <option value="EICHERMOT.NS">Eicher Motors</option>
                    <option value="BRITANNIA.NS">Britannia Industries</option>
                    <option value="TATACONSUM.NS">Tata Consumer Products</option>
                    <option value="CIPLA.NS">Cipla Limited</option>
                    <option value="DIVISLAB.NS">Divi's Laboratories</option>
                    <option value="HDFCLIFE.NS">HDFC Life</option>
                    <option value="SHRIRAMFIN.NS">Shriram Finance</option>
                    <option value="TECHM.NS">Tech Mahindra</option>
                    <option value="BEL.NS">Bharat Electronics</option>
                    <option value="HAL.NS">Hindustan Aeronautics</option>
                    <option value="TRENT.NS">Trent Limited</option>
                  </optgroup>
                </select>
                <div className="absolute right-8 bottom-8 pointer-events-none text-blue-500/70 transition-transform group-hover/select:translate-y-1">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[520px] w-full mt-8 relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-3xl">
                    <p className="text-blue-500 font-black text-2xl animate-pulse italic tracking-widest">LOADING HISTORICAL DATA...</p>
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
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickMargin={25} axisLine={false} tickLine={false} fontStyle="italic" fontWeight="900" />
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
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500 transition-colors shadow-2xl">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
            </div>

            <div className="space-y-6 mb-16">
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.5em] ml-2 italic">Net Account Liquidity</p>
              <div className="text-7xl font-black text-green-400 tracking-tighter drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                <span className="text-4xl mr-2 opacity-60">$</span>{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-10">
                <div className="bg-white/[0.03] rounded-[3rem] p-10 border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] italic mb-3">Inventory Profile</p>
                            <p className="text-4xl font-black text-white italic tracking-tighter">{holdings} <span className="text-blue-500 text-base font-black uppercase tracking-widest opacity-90">{ticker} Units</span></p>
                        </div>
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.3em] border border-white/10 active:scale-95 italic shadow-lg"
                        >
                            Log Audit
                        </button>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" style={{ width: `${Math.min((holdings / 100) * 100, 100)}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 space-y-8 shadow-inner">
                    <p className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] italic mb-4">Transmission Payload</p>
                    <div className="flex items-center justify-between">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-3xl hover:bg-white/20 transition-all shadow-2xl active:scale-90">-</button>
                        <div className="flex flex-col items-center">
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="w-32 bg-transparent text-center text-6xl font-black focus:outline-none tracking-tighter text-blue-400"
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-8 rounded-[2rem] transition-all font-black text-3xl tracking-tighter shadow-[0_30px_70px_-20px_rgba(59,130,246,0.6)] active:scale-95 italic group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              COMMIT BUY ORDER
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="w-full bg-transparent hover:bg-red-500/10 text-red-500 border-2 border-red-500/30 py-8 rounded-[2rem] transition-all font-black text-3xl tracking-tighter active:scale-95 italic hover:border-red-500"
            >
              COMMIT SELL ORDER
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
