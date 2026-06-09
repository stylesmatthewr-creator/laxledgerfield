import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Clock } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [view, setView] = useState('LIVE'); // 'LIVE' or 'HISTORY'
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('lax-live');
    return saved ? JSON.parse(saved) : Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', position: 'MIDFIELD', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 }
    }));
  });
  const [pastGames, setPastGames] = useState(() => JSON.parse(localStorage.getItem('lax-history') || '[]'));

  useEffect(() => { localStorage.setItem('lax-live', JSON.stringify(players)); }, [players]);
  useEffect(() => { localStorage.setItem('lax-history', JSON.stringify(pastGames)); }, [pastGames]);

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p => p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p));
  };

  const endGame = () => {
    const gameRecord = { date: new Date().toLocaleDateString(), players };
    setPastGames([...pastGames, gameRecord]);
    setPlayers(players.map(p => ({ ...p, stats: Object.fromEntries(Object.keys(p.stats).map(k => [k, 0])) })));
    alert("Game saved to history!");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 font-sans uppercase text-[#2D3436]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black tracking-tighter">LAX LEDGER</h1>
        <div className="flex gap-2">
          <button onClick={() => setView('LIVE')} className={`p-2 ${view === 'LIVE' ? 'bg-[#2D3436] text-white' : 'border'}`}>LIVE</button>
          <button onClick={() => setView('HISTORY')} className={`p-2 ${view === 'HISTORY' ? 'bg-[#2D3436] text-white' : 'border'}`}><Clock size={16}/></button>
        </div>
      </div>

      {view === 'LIVE' ? (
        <div className="space-y-3 pb-20">
          {players.map((p, idx) => (
            <div key={p.id} className="bg-white border border-[#E8E4DC] p-3 shadow-sm">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, collapsed: !pl.collapsed} : pl))}>
                <div className="flex gap-2 items-center truncate">
                  <span className="font-bold text-xs">#{p.number || '??'}</span>
                  <span className="font-bold text-sm truncate">{p.name || 'ADD NAME'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {!p.collapsed && <div className="text-[9px] font-bold flex gap-2">
                    {POSITIONS[p.position].map(s => <span key={s}>{s.slice(0,2)}:{p.stats[s]}</span>)}
                  </div>}
                  {p.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </div>
              </div>
              
              {!p.collapsed && (
                <div className="mt-3 pt-3 border-t grid grid-cols-5 gap-1">
                  <div className="col-span-5 flex gap-2 mb-2">
                    <input placeholder="#" value={p.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border p-1 text-center text-sm" />
                    <input placeholder="NAME" value={p.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border p-1 text-sm" />
                    <select value={p.position} onChange={(e) => { const n = [...players]; n[idx].position = e.target.value; setPlayers(n); }} className="border p-1 text-[10px]">{Object.keys(POSITIONS).map(pos => <option key={pos} value={pos}>{pos}</option>)}</select>
                  </div>
                  {POSITIONS[p.position].map(s => (
                    <div key={s} className="flex flex-col items-center">
                      <span className="text-[7px] font-bold">{s}</span>
                      <button onClick={() => updateStat(p.id, s, 1)} className="w-full bg-[#2D3436] text-white text-[10px]">+</button>
                      <div className="w-full text-center font-bold text-sm bg-[#F9F7F2] border">{p.stats[s]}</div>
                      <button onClick={() => updateStat(p.id, s, -1)} className="w-full bg-[#2D3436] text-white text-[10px]">-</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button onClick={endGame} className="w-full bg-[#C5A059] text-white font-bold py-3 mt-4 flex justify-center gap-2"><Save size={18}/> END GAME & SAVE</button>
        </div>
      ) : (
        <div className="space-y-4">
          {pastGames.map((g, i) => <div key={i} className="p-4 bg-white border">GAME FROM {g.date}</div>)}
        </div>
      )}
    </div>
  );
};

export default App;
