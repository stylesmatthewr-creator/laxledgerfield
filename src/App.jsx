import React, { useState, useEffect } from 'react';
import { Plus, Minus, Download } from 'lucide-react';

const LacrosseTracker = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-stats');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i,
      number: '',
      name: '',
      stats: { shots: 0, goals: 0, groundBalls: 0, draws: 0, turnovers: 0 }
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

  const exportCSV = () => {
    const headers = ['Number', 'Name', 'Shots', 'Goals', 'GB', 'Draws', 'CTO'];
    const rows = players.map(p => [p.number, p.name, p.stats.shots, p.stats.goals, p.stats.groundBalls, p.stats.draws, p.stats.turnovers]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lacrosse_stats.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 text-[#2D3436]">
      <h1 className="text-2xl font-bold mb-4 text-[#2D3436]">Game Tracker</h1>
      
      <button 
        onClick={exportCSV} 
        className="mb-6 bg-[#C8102E] text-white px-4 py-2 rounded-lg flex items-center shadow-sm w-full justify-center"
      >
        <Download size={18} className="mr-2" /> Export CSV
      </button>

      <div className="space-y-4">
        {players.map((player, idx) => (
          <div key={player.id} className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E4DC] shadow-sm">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="#"
                value={player.number}
                onChange={(e) => {
                  const newP = [...players];
                  newP[idx].number = e.target.value;
                  setPlayers(newP);
                }}
                className="w-16 p-2 border border-[#E8E4DC] rounded bg-[#F9F7F2]"
              />
              <input
                type="text"
                placeholder="Name"
                value={player.name}
                onChange={(e) => {
                  const newP = [...players];
                  newP[idx].name = e.target.value;
                  setPlayers(newP);
                }}
                className="flex-1 p-2 border border-[#E8E4DC] rounded bg-[#F9F7F2]"
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Object.entries(player.stats).map(([stat, value]) => (
                <div key={stat} className="flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#636E72] mb-1">{stat}</span>
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => updateStat(player.id, stat, 1)} className="bg-[#F5A623] p-1 rounded-full text-white"><Plus size={14} /></button>
                    <span className="font-bold text-[#2D3436] text-sm">{value}</span>
                    <button onClick={() => updateStat(player.id, stat, -1)} className="bg-[#2D3436] p-1 rounded-full text-white"><Minus size={14} /></button>
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
