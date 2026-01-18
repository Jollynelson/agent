
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { AgentProfile, Listing } from '../types';
import { StatCard } from './StatCard';
import { getOptimizationTips } from '../services/geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  PieChart, Pie, Cell 
} from 'recharts';

const dummyData = [
  { name: 'Mon', views: 400, inquiries: 24 },
  { name: 'Tue', views: 300, inquiries: 13 },
  { name: 'Wed', views: 200, inquiries: 98 },
  { name: 'Thu', views: 278, inquiries: 39 },
  { name: 'Fri', views: 189, inquiries: 48 },
  { name: 'Sat', views: 239, inquiries: 38 },
  { name: 'Sun', views: 349, inquiries: 43 },
];

const trafficSourceData = [
  { name: 'Search', value: 400 },
  { name: 'Direct Link', value: 300 },
  { name: 'Social Share', value: 300 },
  { name: 'WhatsApp', value: 200 },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

interface PrivateDashboardProps {
  agent: AgentProfile;
}

export const PrivateDashboard: React.FC<PrivateDashboardProps> = ({ agent }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      const result = await getOptimizationTips(agent.stats);
      setTips(result);
      setLoadingTips(false);
    }
    fetchTips();
  }, [agent.stats]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {agent.name.split(' ')[0]}! <span className="text-3xl">👋</span>
          </h1>
          <p className="text-slate-500 mt-1">Here's your performance summary for the last 30 days.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-slate-50">
            <Icons.QrCode size={16} /> My QR
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-700">
            <Icons.Share2 size={16} /> Share Profile
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Inquiries" value="24" icon="MessageSquare" color="blue" />
        <StatCard label="Conversion Rate" value="8.4%" icon="TrendingUp" color="green" />
        <StatCard label="Commission Earned" value="₦1.2M" icon="CreditCard" color="purple" />
        <StatCard label="Saved Listings" value="156" icon="Star" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Traffic & Engagement</h3>
              <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} dot={{r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                  <Line type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={3} dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Listings Analytics Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-bold text-slate-900">Rental Listing Analytics</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Listing</th>
                     <th className="px-6 py-4">Views</th>
                     <th className="px-6 py-4">Saves</th>
                     <th className="px-6 py-4">Inquiries</th>
                     <th className="px-6 py-4">Conv.</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {agent.listings.map((l) => (
                     <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <img src={l.image} className="w-10 h-10 rounded-lg object-cover" />
                           <span className="text-sm font-semibold text-slate-800">{l.location}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">{l.views}</td>
                       <td className="px-6 py-4 text-sm text-slate-600">{l.saves}</td>
                       <td className="px-6 py-4 text-sm text-slate-600 font-bold text-blue-600">{l.inquiries}</td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-600">{l.conversion}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{width: `${l.conversion * 10}%`}} />
                            </div>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          {/* Optimization Tips (Gemini Powered) */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <Icons.Zap size={80} className="absolute -bottom-4 -right-4 opacity-10" />
            <div className="flex items-center gap-2 mb-4">
              <Icons.Award size={20} className="text-indigo-200" />
              <h3 className="text-lg font-bold">Optimization Tips</h3>
            </div>
            {loadingTips ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/6"></div>
              </div>
            ) : (
              <ul className="space-y-4">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-indigo-100 leading-relaxed group">
                    <span className="shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 group-hover:bg-white/40 transition-colors">
                      {idx + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
            <button className="mt-6 w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-sm font-bold transition-all">
              View Detailed Suggestions
            </button>
          </div>

          {/* Traffic Source Pie */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Traffic Sources</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {trafficSourceData.map((source, idx) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{source.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tenant Insights */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Status</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border border-green-100">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500 text-white rounded-xl">
                     <Icons.CheckCircle2 size={16} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-green-800">Identity Verified</p>
                     <p className="text-[10px] text-green-600">Verified via NIMC on 12/2023</p>
                   </div>
                 </div>
                 <Icons.ChevronRight size={14} className="text-green-400" />
               </div>
               
               <div className="p-4 bg-slate-50 rounded-2xl">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase">Trust Score</span>
                   <span className="text-xs font-black text-blue-600">85/100</span>
                 </div>
                 <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{width: '85%'}} />
                 </div>
                 <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                   <Icons.Info size={10} /> Complete 5 more rentals to reach 'Elite' status
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
