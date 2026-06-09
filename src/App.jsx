import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-stats');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0 }
    }));
  });

  useEffect(() => { localStorage.setItem('lax-stats', JSON.stringify(players)); }, [players]);

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p => p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p));
  };

  const toggleCollapse = (id) => {
    setPlayers(players.map(p => p.id === id ? { ...p, collapsed: !p.collapsed } : p));
  };

  const teamTotals = players.reduce((acc, p) => {
    Object.keys(p.stats).forEach(s => acc[s] = (acc[s] || 0) + p.stats[s]);
    return acc;
  }, { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0 });

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 pb-24 font-sans uppercase">
      <h1 className="text-2xl font-black text-center mb-6 tracking-tighter">GAME TRACKER</h1>
      
      <div className="space-y-3">
        {players.map((p, idx) => (
          <div key={p.id} className="bg-white border border-[#E8E4DC] p-3 shadow-sm">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleCollapse(p.id)}>
              <div className="flex gap-2 flex-1">
                <span className="font-bold text-[#2D3436] w-8">#{p.number || '?'}</span>
                <span className="font-bold truncate">{p.name || 'ADD NAME'}</span>
              </div>
              {p.collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
            
            {!p.collapsed && (
              <div className="mt-3">
                <div className="flex gap-2 mb-3">
                  <input placeholder="#" value={p.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border-2 border-[#E8E4DC] p-1 text-center text-sm" />
                  <input placeholder="NAME" value={p.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border-2 border-[#E8E4DC] p-1 text-sm" />
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {Object.entries(p.stats).map(([s, v]) => (
                    <div key={s} className="flex flex-col items-center">
                      <span className="text-[6px] font-bold text-center truncate w-full">{s}</span>
                      <button onClick={() => updateStat(p.id, s, 1)} className="w-full bg-[#2D3436] text-white text-[10px]">+</button>
                      <div className="w-full text-center font-bold text-sm bg-[#F9F7F2]">{v}</div>
                      <button onClick={() => updateStat(p.id, s, -1)} className="w-full bg-[#2D3436] text-white text-[10px]">-</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#2D3436] text-white p-3 border-t-4 border-[#C5A059]">
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-sm">TEAM TOTALS</span>
          <Download size={16} />
        </div>
        <div className="grid grid-cols-6 gap-1 text-center">
          {Object.entries(teamTotals).map(([s, v]) => (
            <div key={s}><p className="text-[6px] opacity-70 truncate">{s}</p><p className="font-black text-sm">{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
