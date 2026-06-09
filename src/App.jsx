import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-stats');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', position: 'MIDFIELD', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 }
    }));
  });

  useEffect(() => { localStorage.setItem('lax-stats', JSON.stringify(players)); }, [players]);

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p => p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p));
  };

  const getVisibleStats = (pos) => POSITIONS[pos] || POSITIONS.MIDFIELD;

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 pb-24 font-sans uppercase text-[#2D3436]">
      <h1 className="text-2xl font-black text-center mb-6 tracking-tighter">LAX LEDGER - GAME TRACKER</h1>
      
      <div className="space-y-3">
        {players.map((p, idx) => {
          const visibleKeys = getVisibleStats(p.position);
          const totalStats = visibleKeys.reduce((sum, key) => sum + p.stats[key], 0);

          return (
            <div key={p.id} className="bg-white border border-[#E8E4DC] p-3 shadow-sm">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, collapsed: !pl.collapsed} : pl))}>
                <div className="flex gap-2 items-center overflow-hidden">
                  <span className="font-bold w-8 text-xs">#{p.number || '?'}</span>
                  <span className="font-bold truncate text-sm">{p.name || 'ADD NAME'}</span>
                  <span className="text-[10px] bg-[#2D3436] text-white px-1">{p.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs">TOTAL: {totalStats}</span>
                  {p.collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </div>
              </div>
              
              {!p.collapsed && (
                <div className="mt-3 pt-3 border-t border-[#F9F7F2]">
                  <div className="flex gap-2 mb-3">
                    <input placeholder="#" value={p.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border-2 border-[#E8E4DC] p-1 text-center text-sm" />
                    <input placeholder="NAME" value={p.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border-2 border-[#E8E4DC] p-1 text-sm" />
                    <select value={p.position} onChange={(e) => { const n = [...players]; n[idx].position = e.target.value; setPlayers(n); }} className="border-2 border-[#E8E4DC] text-[10px] p-1">
                      {Object.keys(POSITIONS).map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {visibleKeys.map((s) => (
                      <div key={s} className="flex flex-col items-center">
                        <span className="text-[6px] font-bold text-center">{s}</span>
                        <button onClick={() => updateStat(p.id, s, 1)} className="w-full bg-[#2D3436] text-white text-[10px]">+</button>
                        <div className="w-full text-center font-bold text-sm bg-[#F9F7F2]">{p.stats[s]}</div>
                        <button onClick={() => updateStat(p.id, s, -1)} className="w-full bg-[#2D3436] text-white text-[10px]">-</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
