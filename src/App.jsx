import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-stats');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i,
      number: '',
      name: '',
      stats: { SHOTS: 0, GDALS: 0, GROUNDBALLS: 0, DRAWS: 0, TURNOVERS: 0 }
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
    <div className="min-h-screen bg-[#F9F7F2] p-4 font-sans uppercase text-[#2D3436]">
      <h1 className="text-2xl font-black text-center mb-4 tracking-tighter">GAME TRACKER</h1>
      
      <button className="w-full border-2 border-[#C5A059] text-[#C5A059] font-bold py-2 mb-6 flex justify-center items-center gap-2 hover:bg-[#C5A059] hover:text-white transition-colors">
        <Download size={18} /> EXPORT CSV
      </button>

      <div className="space-y-6">
        {players.map((player, idx) => (
          <div key={player.id} className="bg-[#FFFFFF] p-4 border border-[#E8E4DC] shadow-sm">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#636E72] mb-1 block">PLAYER</span>
              <div className="flex gap-2">
                <input type="text" placeholder="#" value={player.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border-2 border-[#C5A059] p-2 text-center font-bold" />
                <input type="text" placeholder="NAME" value={player.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border-2 border-[#C5A059] p-2 font-bold" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#636E72] mb-2 block">STATS</span>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(player.stats).map(([stat, value]) => (
                  <div key={stat} className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold text-center truncate">{stat}</span>
                    <button onClick={() => updateStat(player.id, stat, 1)} className="bg-[#2D3436] text-white py-1 font-bold rounded">+</button>
                    <div className="bg-[#F9F7F2] text-center font-black py-1 border border-[#E8E4DC]">{value}</div>
                    <button onClick={() => updateStat(player.id, stat, -1)} className="bg-[#2D3436] text-white py-1 font-bold rounded">-</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
