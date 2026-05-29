
import React, { useState } from 'react';
import { User, UserRole, Property, Booking, Complaint } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';

const SidebarLink: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

const OwnerDashboard: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const data = [
    { name: 'Jan', revenue: 4500, occupancy: 85 },
    { name: 'Feb', revenue: 5200, occupancy: 88 },
    { name: 'Mar', revenue: 4800, occupancy: 92 },
    { name: 'Apr', revenue: 6100, occupancy: 95 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const pieData = [
    { name: 'Occupied', value: 85 },
    { name: 'Vacant', value: 15 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-4"><Icons.Home /></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Units</p>
          <p className="text-2xl font-bold text-slate-900">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-green-500 mb-4"><Icons.Check /></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Occupancy Rate</p>
          <p className="text-2xl font-bold text-slate-900">92%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-blue-500 mb-4"><Icons.Search /></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Monthly Revenue</p>
          <p className="text-2xl font-bold text-slate-900">$12,450</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-red-500 mb-4"><Icons.Bell /></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Maintenance</p>
          <p className="text-2xl font-bold text-slate-900">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Unit Distribution</h3>
          <div className="h-80 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
               <span className="text-2xl font-bold">85%</span>
               <span className="text-xs text-slate-500">Filled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Your Properties</h3>
          <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
            <Icons.Plus /> Add New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Occupancy</th>
                <th className="px-6 py-4">Monthly Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.filter(p => p.ownerId === 'o1').map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded uppercase">{p.type}</span></td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">95%</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TenantDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">Active Rent</h4>
            <p className="text-3xl font-black text-slate-900 mb-4">$2,500</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
              Pay Now
            </button>
          </div>
          <div className="absolute -bottom-8 -right-8 text-blue-100 opacity-20">
             <Icons.Home />
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Next Payment Due</h4>
          <p className="text-3xl font-black text-slate-900 mb-2">March 01</p>
          <p className="text-sm text-slate-400">In 12 days</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Complaints</h4>
          <p className="text-3xl font-black text-slate-900 mb-2">02</p>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 font-bold rounded">1 Pending</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-bold rounded">1 Resolved</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Your Rental Journey</h3>
          <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200">
            View Agreement
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100" />
          <div className="space-y-10">
            <div className="flex gap-6 relative">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center z-10 shadow-lg">
                <Icons.Check />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Check-in at Sunset Heights</h4>
                <p className="text-slate-500">Jan 15, 2024 • 10:00 AM</p>
                <p className="mt-2 text-slate-600 bg-slate-50 p-4 rounded-2xl">Completed inspection and received digital keys. Welcome home!</p>
              </div>
            </div>
            
            <div className="flex gap-6 relative">
              <div className="w-16 h-16 bg-yellow-500 text-white rounded-2xl flex items-center justify-center z-10 shadow-lg">
                <Icons.Settings />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Maintenance: Leaky Faucet</h4>
                <p className="text-slate-500">Feb 02, 2024 • 03:20 PM</p>
                <p className="mt-2 text-slate-600 bg-slate-50 p-4 rounded-2xl">Assigned to technician: David Smith. Scheduled for tomorrow morning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: User | null; properties: Property[] }> = ({ user, properties }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return <div className="text-center py-20">Please log in to access your dashboard.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <SidebarLink active={activeTab === 'overview'} icon={<Icons.Home />} label="Overview" onClick={() => setActiveTab('overview')} />
              <SidebarLink active={activeTab === 'properties'} icon={<Icons.Map />} label={user.role === UserRole.OWNER ? 'My Properties' : 'Current Rental'} onClick={() => setActiveTab('properties')} />
              <SidebarLink active={activeTab === 'payments'} icon={<Icons.Star />} label="Payments" onClick={() => setActiveTab('payments')} />
              <SidebarLink active={activeTab === 'complaints'} icon={<Icons.Bell />} label="Complaints" onClick={() => setActiveTab('complaints')} />
              <SidebarLink active={activeTab === 'settings'} icon={<Icons.Settings />} label="Account Settings" onClick={() => setActiveTab('settings')} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Welcome, {user.name}</h1>
                <p className="text-slate-500">Here's what's happening today.</p>
              </div>
              <div className="flex gap-4">
                 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors relative">
                    <Icons.Bell />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                 </button>
                 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
                    <Icons.MessageSquare />
                 </button>
              </div>
            </header>

            {user.role === UserRole.OWNER ? (
              <OwnerDashboard properties={properties} />
            ) : (
              <TenantDashboard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
