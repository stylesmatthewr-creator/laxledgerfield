import React, { useState, useEffect } from 'react'; 
import { Plus, Minus, Download, UserPlus, Trash2 } from 'lucide-react'; 

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
    <div className="p-4">
      <h1>Game Tracker</h1>
      <button onClick={exportCSV} className="mb-4 bg-blue-600 p-2 rounded">
        <Download className="inline mr-2" />
        Export CSV
      </button>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            {['Shots', 'Goals', 'GB', 'Draws', 'CTO'].map(s => (
              <th key={s} className="border p-2">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => ( 
            <tr key={player.id}>
              <td className="border p-2">
                <input 
                  type="text" 
                  value={player.number} 
                  onChange={(e) => { 
                    const newP = [...players]; 
                    newP[idx].number = e.target.value; 
                    setPlayers(newP); 
                  }} 
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input 
                  type="text" 
                  value={player.name} 
                  onChange={(e) => { 
                    const newP = [...players]; 
                    newP[idx].name = e.target.value; 
                    setPlayers(newP); 
                  }} 
                  className="w-full"
                />
              </td>
              {Object.keys(player.stats).map((stat) => ( 
                <td key={stat} className="border p-2 text-center">
                  <div className="flex gap-1 justify-center">
                    <button 
                      onClick={() => updateStat(player.id, stat, -1)} 
                      className="bg-slate-700 p-1 rounded hover:bg-red-900"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{player.stats[stat]}</span>
                    <button 
                      onClick={() => updateStat(player.id, stat, 1)} 
                      className="bg-amber-600 p-1 rounded hover:bg-amber-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
              ))} 
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  ); 
}; 

export default LacrosseTracker;