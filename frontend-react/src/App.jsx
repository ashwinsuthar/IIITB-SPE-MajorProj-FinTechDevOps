import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8081/api'; // Direct to User Service for now to avoid Eureka delay

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password || password.length < 5) {
      alert('Invalid password! Please enter a valid password (e.g. pass1234_company...).');
      return;
    }
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-blue-400 text-center">StockSystem</h2>
        <p className="text-gray-400 text-center mb-8">Sign in to your trading account</p>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm text-gray-400 mb-2">Username or Email</label>
            <input
              type="text"
              placeholder="e.g. trader@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition font-semibold text-lg shadow-lg hover:shadow-blue-500/50"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(10000);
  const [orderCount, setOrderCount] = useState(0);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`);
      setPortfolioValue(response.data.balance || 10000);
      setOrderCount(response.data.orderCount || 0);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  const handleBuy = async () => {
    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: 10,
        price: 100.0,
        type: 'BUY'
      });
      alert(`[BACKEND] BUY ORDER SAVED: 10 shares of ${ticker}`);
      fetchPortfolio();
    } catch (err) {
      alert('Error placing buy order. Is the backend running?');
    }
  };

  const handleSell = async () => {
    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: 10,
        price: 100.0,
        type: 'SELL'
      });
      alert(`[BACKEND] SELL ORDER SAVED: 10 shares of ${ticker}`);
      fetchPortfolio();
    } catch (err) {
      alert('Error placing sell order. Is the backend running?');
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Mock prices
    setData([
      { name: 'Day 1', price: 100 },
      { name: 'Day 2', price: 105 },
      { name: 'Day 3', price: 102 },
      { name: 'Day 4', price: 110 },
      { name: 'Day 5', price: 112 },
    ]);
    const interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, [ticker]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8 border-b border-gray-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Stock Portfolio & Trade Execution System</h1>
          <p className="text-gray-400 mt-2">Real-time Trading & Risk Management Dashboard (Connected to Backend)</p>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded transition"
        >
          Sign Out
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Market Data ({ticker})</h2>
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              <optgroup label="US Stocks">
                <option value="AAPL">AAPL - Apple Inc.</option>
                <option value="MSFT">MSFT - Microsoft Corp.</option>
                <option value="GOOGL">GOOGL - Alphabet Inc.</option>
                <option value="AMZN">AMZN - Amazon.com Inc.</option>
                <option value="TSLA">TSLA - Tesla Inc.</option>
                <option value="META">META - Meta Platforms Inc.</option>
                <option value="NVDA">NVDA - NVIDIA Corp.</option>
                <option value="NFLX">NFLX - Netflix Inc.</option>
                <option value="JPM">JPM - JPMorgan Chase & Co.</option>
                <option value="V">V - Visa Inc.</option>
                <option value="JNJ">JNJ - Johnson & Johnson</option>
                <option value="WMT">WMT - Walmart Inc.</option>
                <option value="PG">PG - Procter & Gamble Co.</option>
                <option value="MA">MA - Mastercard Inc.</option>
                <option value="UNH">UNH - UnitedHealth Group</option>
                <option value="DIS">DIS - The Walt Disney Co.</option>
                <option value="HD">HD - Home Depot Inc.</option>
                <option value="VZ">VZ - Verizon Communications</option>
                <option value="CVX">CVX - Chevron Corp.</option>
                <option value="PEP">PEP - PepsiCo Inc.</option>
                <option value="KO">KO - Coca-Cola Co.</option>
                <option value="MRK">MRK - Merck & Co.</option>
                <option value="BAC">BAC - Bank of America</option>
                <option value="INTC">INTC - Intel Corp.</option>
                <option value="CSCO">CSCO - Cisco Systems</option>
              </optgroup>
              <optgroup label="Indian Stocks">
                <option value="RELIANCE.NS">RELIANCE.NS - Reliance Industries</option>
                <option value="TCS.NS">TCS.NS - Tata Consultancy Services</option>
                <option value="HDFCBANK.NS">HDFCBANK.NS - HDFC Bank</option>
                <option value="INFY.NS">INFY.NS - Infosys Ltd.</option>
                <option value="ICICIBANK.NS">ICICIBANK.NS - ICICI Bank</option>
                <option value="HINDUNILVR.NS">HINDUNILVR.NS - Hindustan Unilever</option>
                <option value="ITC.NS">ITC.NS - ITC Limited</option>
                <option value="SBIN.NS">SBIN.NS - State Bank of India</option>
                <option value="BHARTIARTL.NS">BHARTIARTL.NS - Bharti Airtel</option>
                <option value="KOTAKBANK.NS">KOTAKBANK.NS - Kotak Mahindra Bank</option>
                <option value="BAJFINANCE.NS">BAJFINANCE.NS - Bajaj Finance</option>
                <option value="LT.NS">LT.NS - Larsen & Toubro</option>
                <option value="WIPRO.NS">WIPRO.NS - Wipro Limited</option>
                <option value="HCLTECH.NS">HCLTECH.NS - HCL Technologies</option>
                <option value="ASIANPAINT.NS">ASIANPAINT.NS - Asian Paints</option>
                <option value="MARUTI.NS">MARUTI.NS - Maruti Suzuki</option>
                <option value="SUNPHARMA.NS">SUNPHARMA.NS - Sun Pharma</option>
                <option value="ULTRACEMCO.NS">ULTRACEMCO.NS - UltraTech Cement</option>
                <option value="TATAMOTORS.NS">TATAMOTORS.NS - Tata Motors</option>
                <option value="TATASTEEL.NS">TATASTEEL.NS - Tata Steel</option>
                <option value="POWERGRID.NS">POWERGRID.NS - Power Grid Corp</option>
                <option value="NTPC.NS">NTPC.NS - NTPC Limited</option>
                <option value="BAJAJFINSV.NS">BAJAJFINSV.NS - Bajaj Finserv</option>
                <option value="AXISBANK.NS">AXISBANK.NS - Axis Bank</option>
                <option value="M&M.NS">M&M.NS - Mahindra & Mahindra</option>
              </optgroup>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between border border-gray-700">
          <div>
            <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
            <div className="text-4xl font-bold text-green-400">${portfolioValue.toLocaleString()}</div>
            <p className="text-gray-400 mt-2">Trades Count: {orderCount}</p>
          </div>
          <div className="mt-8 space-y-4">
            <button onClick={handleBuy} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition font-medium shadow-lg shadow-blue-500/20">Buy Stock</button>
            <button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition font-medium shadow-lg shadow-red-500/20">Sell Stock</button>
          </div>
        </section>
      </main>
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
