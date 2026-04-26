import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Login() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-blue-400 text-center">StockSystem</h2>
        <p className="text-gray-400 text-center mb-8">Sign in to your trading account</p>
        
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
          <div className="mb-5">
            <label className="block text-sm text-gray-400 mb-2">Username or Email</label>
            <input 
              type="text" 
              placeholder="e.g. trader@example.com"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600" 
              required 
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
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
  const [portfolioValue, setPortfolioValue] = useState(15000);

  useEffect(() => {
    // Mock fetch data from Gateway or Python Service directly
    setData([
      { name: 'Day 1', price: 100 },
      { name: 'Day 2', price: 105 },
      { name: 'Day 3', price: 102 },
      { name: 'Day 4', price: 110 },
      { name: 'Day 5', price: 112 },
    ]);
  }, [ticker]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8 border-b border-gray-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Stock Portfolio & Trade Execution System</h1>
          <p className="text-gray-400 mt-2">Real-time Trading & Risk Management Dashboard</p>
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
            <input 
              type="text" 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-gray-700 text-white px-3 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
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
            <p className="text-gray-400 mt-2">+5.2% Today</p>
          </div>
          <div className="mt-8 space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition font-medium shadow-lg shadow-blue-500/20">Buy Stock</button>
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition font-medium shadow-lg shadow-red-500/20">Sell Stock</button>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  // Route to Login implicitly if hitting /login
  if (path === '/login') {
    return <Login />;
  }
  // Default to Dashboard
  return <Dashboard />;
}

export default App;
