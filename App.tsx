
import React, { useState } from 'react';
import { Icons } from './components/Icons';
import { PublicProfile } from './components/PublicProfile';
import { PrivateDashboard } from './components/PrivateDashboard';
import { mockAgent } from './data';

enum ViewMode {
  Public = 'public',
  Private = 'private'
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Public);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl italic">BT</div>
          <span className="text-lg font-black tracking-tight text-slate-900 hidden sm:block">BetterTenant</span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode(ViewMode.Public)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === ViewMode.Public ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icons.UserCircle size={14} /> Public View
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.Private)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === ViewMode.Private ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icons.LayoutDashboard size={14} /> Dashboard
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Icons.MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <img 
            src={mockAgent.photo} 
            alt="User Profile" 
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 cursor-pointer hover:border-blue-300 transition-colors"
          />
        </div>
      </nav>

      <main className="flex-1 pb-20">
        {viewMode === ViewMode.Public ? (
          <PublicProfile agent={mockAgent} />
        ) : (
          <PrivateDashboard agent={mockAgent} />
        )}
      </main>

      {/* Footer / Contact Sticky for Public Mobile */}
      {viewMode === ViewMode.Public && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm md:hidden bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl p-4 z-40 flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Chat with</span>
             <span className="text-sm font-bold text-slate-900">{mockAgent.name.split(' ')[0]}</span>
           </div>
           <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
             Contact Agent
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
