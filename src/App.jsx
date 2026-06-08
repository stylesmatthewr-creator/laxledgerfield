import React, { useState, useEffect } from 'react';
import { Plus, Minus, Download } from 'lucide-react';

const LacrosseTracker = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-stats');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i,
      number: '',
      name: '',
      stats: { SHOTS: 0, GOALS: 0, GB: 0, DRAWS: 0, CTO: 0 }
    }));
  });

  useEffect(() => {
    localStorage.setItem('lax-stats', JSON.stringify(players));
  }, [players]);

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p =>
      p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p
    ));
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-2 font-sans uppercase text-[#2D3436]">
      <h1 className="text-lg font-bold mb-3 text-[#2D3436]">GAME TRACKER</h1>
      
      <button onClick={() => {
          const headers = ['#', 'NAME', 'SHOTS', 'GOALS', 'GB', 'DRAWS', 'CTO'];
          const rows = players.map(p => [p.number, p.name, p.stats.SHOTS, p.stats.GOALS, p.stats.GB, p.stats.DRAWS, p.stats.CTO]);
          const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
          const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
          const a = document.createElement('a');
          a.href = url;
          a.download = 'stats.csv';
          a.click();
      }} className="mb-4 bg-[#C8102E] text-white w-full py-2 rounded font-bold text-xs shadow-md">
        <Download size={14} className="inline mr-2" /> EXPORT CSV
      </button>

      <div className="space-y-2">
        {players.map((player, idx) => (
          <div key={player.id} className="bg-[#FFFFFF] p-2 rounded border border-[#E8E4DC] shadow-sm">
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="#" value={player.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-10 p-1 border border-[#E8E4DC] bg-[#F9F7F2] text-[10px]" />
              <input type="text" placeholder="NAME" value={player.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 p-1 border border-[#E8E4DC] bg-[#F9F7F2] text-[10px]" />
            </div>

            <div className="grid grid-cols-5 gap-1">
              {Object.entries(player.stats).map(([stat, value]) => (
                <div key={stat} className="flex flex-col items-center gap-1">
                  <span className="text-[8px] text-[#636E72] font-bold truncate w-full text-center">{stat}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateStat(player.id, stat, -1)} className="bg-[#2D3436] text-white px-1 py-0.5 rounded text-[10px] font-bold">-</button>
                    <span className="text-xs font-bold w-4 text-center">{value}</span>
                    <button onClick={() => updateStat(player.id, stat, 1)} className="bg-[#F5A623] text-white px-1 py-0.5 rounded text-[10px] font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LacrosseTracker;
