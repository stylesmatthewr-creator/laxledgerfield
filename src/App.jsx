import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Clock, ArrowLeft, Trash2, Plus } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [gameState, setGameState] = useState('SETUP');
  const [gameInfo, setGameInfo] = useState({ date: new Date().toLocaleDateString(), myTeam: '', opponent: '' });
  const [players, setPlayers] = useState(() => Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', position: 'MIDFIELD', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 }
  })));
  const [pastGames, setPastGames] = useState(() => JSON.parse(localStorage.getItem('lax-history') || '[]'));
  const [selectedGame, setSelectedGame] = useState(null);

  const updateStat = (id, stat, delta) => {
    setPlayers(players.map(p => p.id === id ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, p.stats[stat] + delta) } } : p));
  };

  const getSavePercentage = (p) => {
    return p.stats.SHOTS > 0 ? ((p.stats.SAVES / p.stats.SHOTS) * 100).toFixed(0) + '%' : '0%';
  };

  const endGame = () => {
    const newHistory = [...pastGames, { ...gameInfo, players, id: Date.now() }];
    setPastGames(newHistory);
    localStorage.setItem('lax-history', JSON.stringify(newHistory));
    setGameState('HISTORY');
  };

  const deleteGame = (e, id) => {
    e.stopPropagation();
    const updated = pastGames.filter(g => g.id !== id);
    setPastGames(updated);
    localStorage.setItem('lax-history', JSON.stringify(updated));
  };

  if (gameState === 'SETUP') return (
    <div className="p-6 bg-[#F9F7F2] min-h-screen text-[#2D3436]">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest">Welcome to</p>
        <h1 className="text-3xl font-black uppercase tracking-tighter">LAXLEDGER – FIELD</h1>
      </div>
      <h2 className="text-xl font-bold mb-4 uppercase">Game Setup</h2>
      <input className="w-full p-3 mb-3 border border-[#E8E4DC]" defaultValue={gameInfo.date} onChange={(e) => setGameInfo({...gameInfo, date: e.target.value})} />
      <input className="w-full p-3 mb-3 border border-[#E8E4DC]" placeholder="MY TEAM" onChange={(e) => setGameInfo({...gameInfo, myTeam: e.target.value})} />
      <input className="w-full p-3 mb-6 border border-[#E8E4DC]" placeholder="OPPONENT" onChange={(e) => setGameInfo({...gameInfo, opponent: e.target.value})} />
      <button onClick={() => setGameState('LIVE')} className="w-full bg-[#2D3436] text-white py-4 font-bold mb-4">START GAME</button>
      <button onClick={() => setGameState('HISTORY')} className="w-full bg-[#E8E4DC] py-4 font-bold">VIEW HISTORY</button>
    </div>
  );

  if (gameState === 'HISTORY') return (
    <div className="p-4 bg-[#F9F7F2] min-h-screen text-[#2D3436]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState('SETUP')}><ArrowLeft/></button>
        <h1 className="text-xl font-black uppercase">PAST GAMES</h1>
        <button onClick={() => setGameState('SETUP')} className="bg-[#2D3436] text-white p-2"><Plus size={16}/></button>
      </div>
      <div className="space-y-3">
        {[...pastGames].reverse().map(g => (
          <div key={g.id} onClick={() => { setSelectedGame(g); setGameState('VIEW_GAME'); }} className="w-full p-4 bg-white border border-[#E8E4DC] flex justify-between items-center font-bold uppercase cursor-pointer">
            <span>{g.date} | {g.myTeam} vs {g.opponent}</span>
            <button onClick={(e) => deleteGame(e, g.id)} className="text-red-900"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 font-sans uppercase text-[#2D3436]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => { setSelectedGame(null); setGameState('HISTORY'); }}><ArrowLeft/></button>
        <h1 className="text-xl font-black tracking-tighter">{gameState === 'VIEW_GAME' ? 'GAME REVIEW' : 'LAX LEDGER'}</h1>
        {gameState === 'LIVE' && <button onClick={endGame} className="bg-red-900 text-white px-3 py-1 text-xs font-bold">END</button>}
      </div>

      <div className="space-y-3 pb-20">
        {(selectedGame?.players || players).map((p, idx) => (
          <div key={p.id} className="bg-white border border-[#E8E4DC] p-3 shadow-sm">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => !selectedGame && setPlayers(players.map(pl => pl.id === p.id ? {...pl, collapsed: !pl.collapsed} : pl))}>
              <div className="truncate"><span className="text-xs">#{p.number || '??'}</span> <span className="font-bold text-sm">{p.name || 'ADD NAME'}</span></div>
              {p.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
            {!p.collapsed && (
              <div className="mt-3 pt-3 border-t">
                {/* RESTORED: These are the editable fields */}
                <div className="flex gap-2 mb-3">
                  <input placeholder="#" value={p.number} onChange={(e) => { const n = [...players]; n[idx].number = e.target.value; setPlayers(n); }} className="w-12 border p-1 text-sm" />
                  <input placeholder="NAME" value={p.name} onChange={(e) => { const n = [...players]; n[idx].name = e.target.value; setPlayers(n); }} className="flex-1 border p-1 text-sm" />
                  <select value={p.position} onChange={(e) => { const n = [...players]; n[idx].position = e.target.value; setPlayers(n); }} className="border p-1 text-[10px]">{Object.keys(POSITIONS).map(pos => <option key={pos} value={pos}>{pos}</option>)}</select>
                </div>
                {/* Rest of the stat UI */}
                <div className="flex overflow-x-auto gap-1">
                  {POSITIONS[p.position].map(s => (
                    <div key={s} className="flex flex-col items-center min-w-[50px]">
                      <span className="text-[7px] font-bold">{s}</span>
                      {!selectedGame && <button onClick={() => updateStat(p.id, s, 1)} className="w-full bg-[#2D3436] text-white">+</button>}
                      <div className="w-full text-center font-bold text-sm border bg-[#F9F7F2]">{p.stats[s]}</div>
                      {!selectedGame && <button onClick={() => updateStat(p.id, s, -1)} className="w-full bg-[#2D3436] text-white">-</button>}
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
