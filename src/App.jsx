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
      <h1 className="text-xl font-bold mb-4 bg-[#C8102E] text-white p-2 text-center">DEBUG: NEW LAYOUT</h1>
      
      <div className="space-y-2">
        {players.map((player, idx) => (
          <div key={player.id} className="bg-[#FFFFFF] p-2 rounded border-4 border-[#C5A059]">
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="#" value={player.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-10 p-1 border border-[#E8E4DC] bg-[#F9F7F2]" />
              <input type="text" placeholder="NAME" value={player.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 p-1 border border-[#E8E4DC] bg-[#F9F7F2]" />
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(player.stats).map(([stat, value]) => (
                <div key={stat} className="flex flex-col items-center">
                  <span className="text-[8px] text-[#636E72]">{stat}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateStat(player.id, stat, -1)} className="bg-[#2D3436] text-white px-2 rounded">-</button>
                    <span className="font-bold text-sm">{value}</span>
                    <button onClick={() => updateStat(player.id, stat, 1)} className="bg-[#F5A623] text-white px-2 rounded">+</button>
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
