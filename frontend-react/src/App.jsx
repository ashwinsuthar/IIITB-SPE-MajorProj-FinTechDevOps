import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
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
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Stock Portfolio & Trade Execution System</h1>
        <p className="text-gray-400 mt-2">Real-time Trading & Risk Management Dashboard</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Market Data ({ticker})</h2>
            <input 
              type="text" 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-gray-700 text-white px-3 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
            <div className="text-4xl font-bold text-green-400">${portfolioValue.toLocaleString()}</div>
            <p className="text-gray-400 mt-2">+5.2% Today</p>
          </div>
          <div className="mt-8 space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Buy Stock</button>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">Sell Stock</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
