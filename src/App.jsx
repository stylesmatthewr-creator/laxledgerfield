import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Clock, Play } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [gameState, setGameState] = useState('SETUP'); // SETUP, LIVE, HISTORY
  const [gameInfo, setGameInfo] = useState({ date: '', teams: '' });
  const [players, setPlayers] = useState(() => Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', position: 'MIDFIELD', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 }
  })));
  const [pastGames, setPastGames] = useState(() => JSON.parse(localStorage.getItem('lax-history') || '[]'));

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p => p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p));
  };

  const endGame = () => {
    setPastGames([...pastGames, { ...gameInfo, players }]);
    setGameState('SETUP');
  };

  if (gameState === 'SETUP') return (
    <div className="p-6 bg-[#F9F7F2] min-h-screen">
      <h1 className="text-2xl font-black mb-6">GAME SETUP</h1>
      <input className="w-full p-3 mb-3 border" placeholder="DATE" onChange={(e) => setGameInfo({...gameInfo, date: e.target.value})} />
      <input className="w-full p-3 mb-6 border" placeholder="TEAMS" onChange={(e) => setGameInfo({...gameInfo, teams: e.target.value})} />
      <button onClick={() => setGameState('LIVE')} className="w-full bg-[#2D3436] text-white py-4 font-bold">START GAME</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 font-sans uppercase">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black">LAX LEDGER</h1>
        <button onClick={endGame} className="bg-red-900 text-white px-3 py-1 text-xs">END</button>
      </div>

      <div className="space-y-3 pb-20">
        {players.map((p, idx) => (
          <div key={p.id} className="bg-white border p-3 shadow-sm">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, collapsed: !pl.collapsed} : pl))}>
              <div className="truncate"><span className="text-xs">#{p.number || '??'}</span> <span className="font-bold text-sm">{p.name || 'ADD NAME'}</span></div>
              {p.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
            
            {p.collapsed ? (
              <div className="flex gap-3 mt-2 overflow-x-auto text-[10px] font-bold">
                {POSITIONS[p.position].map(s => <span key={s}>{s.slice(0,2)}:{p.stats[s]}</span>)}
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2 mb-3">
                  <input placeholder="#" value={p.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border p-1 text-sm" />
                  <input placeholder="NAME" value={p.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border p-1 text-sm" />
                  <select value={p.position} onChange={(e) => { const n = [...players]; n[idx].position = e.target.value; setPlayers(n); }} className="border p-1 text-[10px]">{Object.keys(POSITIONS).map(pos => <option key={pos} value={pos}>{pos}</option>)}</select>
                </div>
                <div className="flex overflow-x-auto gap-1">
                  {POSITIONS[p.position].map(s => (
                    <div key={s} className="flex flex-col items-center min-w-[50px]">
                      <span className="text-[7px] font-bold">{s}</span>
                      <button onClick={() => updateStat(p.id, s, 1)} className="w-full bg-[#2D3436] text-white">+</button>
                      <div className="w-full text-center font-bold text-sm border">{p.stats[s]}</div>
                      <button onClick={() => updateStat(p.id, s, -1)} className="w-full bg-[#2D3436] text-white">-</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
