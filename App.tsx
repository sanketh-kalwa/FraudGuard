/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Home, Activity, BrainCircuit, BarChart3, Settings, 
  Play, Square, AlertTriangle, CheckCircle, Download, Database,
  TrendingUp, Users, DollarSign, ShieldAlert
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

// --- Mock Data Generators ---
const MERCHANTS = ['Amazon', 'Walmart', 'Target', 'BestBuy', 'Starbucks', 'Uber', 'Netflix', 'Apple'];
const LOCATIONS = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Tokyo'];
const FRAUD_REASONS = [
  'Velocity limit exceeded',
  'Location anomaly detected',
  'Unusual transaction amount',
  'High-risk merchant category',
  'Multiple failed attempts prior',
  'Suspicious IP address'
];

const generateTransaction = (forceFraud = false) => {
  const isFraud = forceFraud || Math.random() < 0.08;
  const amount = isFraud ? (Math.random() * 2000 + 500) : (Math.random() * 150 + 5);
  const prob = isFraud ? (0.75 + Math.random() * 0.24) : (Math.random() * 0.3);
  const remarks = isFraud ? FRAUD_REASONS[Math.floor(Math.random() * FRAUD_REASONS.length)] : '';
  
  return {
    id: Math.random().toString(36).substring(2, 10).toUpperCase(),
    userId: `U${Math.floor(Math.random() * 9000) + 1000}`,
    amount: parseFloat(amount.toFixed(2)),
    timestamp: new Date().toISOString(),
    merchant: MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    isFraud,
    fraudProbability: parseFloat(prob.toFixed(3)),
    remarks
  };
};

const generateInitialData = (count) => {
  return Array.from({ length: count }, () => generateTransaction());
};

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Initialize some data
  useEffect(() => {
    setTransactions(generateInitialData(100));
  }, []);

  // Streaming logic
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        setTransactions(prev => [generateTransaction(), ...prev].slice(0, 2000)); // Keep last 2000
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Derived metrics
  const metrics = useMemo(() => {
    const total = transactions.length;
    const fraudCount = transactions.filter(t => t.isFraud).length;
    const fraudRate = total > 0 ? (fraudCount / total) * 100 : 0;
    const volume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = total > 0 ? volume / total : 0;

    return { total, fraudCount, fraudRate, volume, avgAmount };
  }, [transactions]);

  // Render helpers
  const renderTabButton = (id, label, Icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FraudGuard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderTabButton('dashboard', 'Dashboard', BarChart3)}
          {renderTabButton('monitor', 'Real-Time Monitor', Activity)}
          {renderTabButton('fraud-detected', 'Fraud Detected', ShieldAlert)}
          {renderTabButton('training', 'Model Training', BrainCircuit)}
          {renderTabButton('analytics', 'Analytics', TrendingUp)}
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            {renderTabButton('navigation', 'Navigation', Home)}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Database className="w-4 h-4" /> System Status
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isModelTrained ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <span className={isModelTrained ? 'text-green-400' : 'text-amber-400'}>
                {isModelTrained ? 'Model Active' : 'Model Untrained'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className={isStreaming ? 'text-blue-400' : 'text-slate-400'}>
                {isStreaming ? 'Stream Live' : 'Stream Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          
          {/* NAVIGATION TAB (formerly Home) */}
          {activeTab === 'navigation' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Real-Time Fraud Detection System</h2>
                <p className="text-lg text-slate-600 max-w-3xl mb-8">
                  Welcome to the interactive preview of your Fraud Detection Dashboard. 
                  This UI simulates the Python/Streamlit application you requested, running directly in your browser.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">1. Train the Model</h3>
                    <p className="text-sm text-slate-600">Go to Model Training to initialize the XGBoost classifier simulation.</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">2. Start Streaming</h3>
                    <p className="text-sm text-slate-600">Open the Real-Time Monitor to watch live transactions being scored.</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">3. Analyze Data</h3>
                    <p className="text-sm text-slate-600">View the Dashboard and Analytics tabs to see patterns and metrics.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900">Python Code Available</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    The actual Python/Streamlit code has been generated in the <code>python_project</code> folder. 
                    You can download it via <strong>Settings &gt; Export as ZIP</strong> to run locally.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-900">System Dashboard</h2>
              
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Transactions</h3>
                    <Database className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{metrics.total.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Fraud Rate</h3>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{metrics.fraudRate.toFixed(2)}%</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Volume</h3>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">${metrics.volume.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Avg Transaction</h3>
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">${metrics.avgAmount.toFixed(2)}</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Fraud Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Safe', value: metrics.total - metrics.fraudCount },
                            { name: 'Fraud', value: metrics.fraudCount }
                          ]}
                          cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">ID</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Merchant</th>
                          <th className="px-4 py-3 rounded-tr-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 5).map((tx) => (
                          <tr key={tx.id} className="border-b border-slate-100 last:border-0">
                            <td className="px-4 py-3 font-mono text-slate-600">{tx.id}</td>
                            <td className="px-4 py-3 font-medium">${tx.amount.toFixed(2)}</td>
                            <td className="px-4 py-3">{tx.merchant}</td>
                            <td className="px-4 py-3">
                              {tx.isFraud ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  <AlertTriangle className="w-3 h-3" /> Fraud
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3" /> Safe
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MONITOR TAB */}
          {activeTab === 'monitor' && (
            <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Real-Time Monitor</h2>
                  <p className="text-slate-500 mt-1">Live transaction scoring via simulated Kafka stream</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {!isModelTrained && (
                    <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Model not trained
                    </span>
                  )}
                  <button
                    onClick={() => setIsStreaming(!isStreaming)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isStreaming 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isStreaming ? (
                      <><Square className="w-4 h-4" fill="currentColor" /> Stop Stream</>
                    ) : (
                      <><Play className="w-4 h-4" fill="currentColor" /> Start Live Stream</>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Merchant</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Risk Score</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 50).map((tx, idx) => (
                        <tr 
                          key={tx.id} 
                          className={`
                            transition-colors duration-500
                            ${idx === 0 && isStreaming ? 'bg-blue-50/50' : 'hover:bg-slate-50'}
                            ${tx.isFraud && isModelTrained ? 'bg-red-50/30' : ''}
                          `}
                        >
                          <td className="px-6 py-4 text-slate-500">
                            {format(new Date(tx.timestamp), 'HH:mm:ss')}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">{tx.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{tx.merchant}</td>
                          <td className="px-6 py-4">${tx.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {isModelTrained ? (
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${tx.fraudProbability > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${tx.fraudProbability * 100}%` }}
                                  ></div>
                                </div>
                                <span className={`font-mono text-xs ${tx.fraudProbability > 0.5 ? 'text-red-600' : 'text-slate-500'}`}>
                                  {(tx.fraudProbability * 100).toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Untrained</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {!isModelTrained ? (
                              <span className="text-slate-400">-</span>
                            ) : tx.fraudProbability > 0.5 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                BLOCKED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                ALLOWED
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TRAINING TAB */}
          {activeTab === 'training' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900">Model Training</h2>
              
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                    <BrainCircuit className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">XGBoost Classifier</h3>
                    <p className="text-slate-600 mb-6">
                      Train the machine learning model on historical transaction data to detect fraudulent patterns.
                      The model uses 19 engineered features including time-based metrics, velocity, and amount logs.
                    </p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500">Available Training Samples:</span>
                        <span className="font-medium text-slate-900">{transactions.length.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Algorithm:</span>
                        <span className="font-medium text-slate-900">XGBoost (n_estimators=100, max_depth=5)</span>
                      </div>
                    </div>

                    {!isTraining && !isModelTrained && (
                      <button
                        onClick={() => {
                          setIsTraining(true);
                          setTrainingProgress(0);
                          const interval = setInterval(() => {
                            setTrainingProgress(p => {
                              if (p >= 100) {
                                clearInterval(interval);
                                setIsTraining(false);
                                setIsModelTrained(true);
                                return 100;
                              }
                              return p + 5;
                            });
                          }, 100);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" /> Start Training
                      </button>
                    )}

                    {isTraining && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-indigo-600">
                          <span>Training Model...</span>
                          <span>{trainingProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-100 ease-linear"
                            style={{ width: `${trainingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {isModelTrained && !isTraining && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900">Training Complete</h4>
                          <p className="text-green-800 text-sm mt-1">
                            Model achieved <strong>96.4%</strong> accuracy on the validation set. 
                            It is now active and scoring transactions in the Real-Time Monitor.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-900">Advanced Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Transactions by Merchant</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={MERCHANTS.map(m => ({
                          name: m,
                          count: transactions.filter(t => t.merchant === m).length,
                          fraud: transactions.filter(t => t.merchant === m && t.isFraud).length
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f8fafc'}} />
                        <Legend />
                        <Bar dataKey="count" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="fraud" name="Fraud" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Transaction Volume Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={transactions.slice(0, 20).reverse().map((t, i) => ({
                          index: i,
                          amount: t.amount
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="index" hide />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FRAUD DETECTED TAB */}
          {activeTab === 'fraud-detected' && (
            <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Fraud Detected</h2>
                  <p className="text-slate-500 mt-1">Log of all blocked transactions and their trigger reasons</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Merchant</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Risk Score</th>
                        <th className="px-6 py-4">Remarks / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.filter(t => t.isFraud).slice(0, 50).map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50 bg-red-50/10">
                          <td className="px-6 py-4 text-slate-500">
                            {format(new Date(tx.timestamp), 'HH:mm:ss')}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">{tx.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{tx.merchant}</td>
                          <td className="px-6 py-4">${tx.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-red-600 font-semibold">
                              {(tx.fraudProbability * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-red-700 text-xs font-medium">
                            {tx.remarks}
                          </td>
                        </tr>
                      ))}
                      {transactions.filter(t => t.isFraud).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                            No fraudulent transactions detected yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
