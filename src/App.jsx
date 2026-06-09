import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Clock, ArrowLeft } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [gameState, setGameState] = useState('SETUP'); // SETUP, LIVE, HISTORY, VIEW_GAME
  const [gameInfo, setGameInfo] = useState({ date: new Date().toLocaleDateString(), myTeam: '', opponent: '' });
  const [players, setPlayers] = useState(() => Array.from({ length: 15 }, (_, i) => ({
      id: i, number: '', name: '', position: 'MIDFIELD', collapsed: true,
      stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 }
  })));
  const [pastGames, setPastGames] = useState(() => JSON.parse(localStorage.getItem('lax-history') || '[]'));
  const [selectedGame, setSelectedGame] = useState(null);

  const endGame = () => {
    const newHistory = [...pastGames, { ...gameInfo, players, id: Date.now() }];
    setPastGames(newHistory);
    localStorage.setItem('lax-history', JSON.stringify(newHistory));
    setGameState('HISTORY');
  };

  // Setup/Home Screen
  if (gameState === 'SETUP') return (
    <div className="p-6 bg-[#F9F7F2] min-h-screen">
      <h1 className="text-2xl font-black mb-6">GAME SETUP</h1>
      <input className="w-full p-3 mb-3 border" defaultValue={gameInfo.date} onChange={(e) => setGameInfo({...gameInfo, date: e.target.value})} />
      <input className="w-full p-3 mb-3 border" placeholder="MY TEAM" onChange={(e) => setGameInfo({...gameInfo, myTeam: e.target.value})} />
      <input className="w-full p-3 mb-6 border" placeholder="OPPONENT" onChange={(e) => setGameInfo({...gameInfo, opponent: e.target.value})} />
      <button onClick={() => setGameState('LIVE')} className="w-full bg-[#2D3436] text-white py-4 font-bold mb-4">START GAME</button>
      <button onClick={() => setGameState('HISTORY')} className="w-full bg-gray-200 py-4 font-bold">VIEW HISTORY</button>
    </div>
  );

  // History / Homepage View
  if (gameState === 'HISTORY') return (
    <div className="p-4 bg-[#F9F7F2] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black">PAST GAMES</h1>
        <button onClick={() => setGameState('SETUP')} className="bg-[#2D3436] text-white px-4 py-2">NEW GAME</button>
      </div>
      <div className="space-y-3">
        {[...pastGames].reverse().map(g => (
          <button key={g.id} onClick={() => { setSelectedGame(g); setGameState('VIEW_GAME'); }} className="w-full p-4 bg-white border text-left font-bold">
            {g.date} | {g.myTeam} vs {g.opponent}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 font-sans uppercase text-[#2D3436]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState(gameState === 'VIEW_GAME' ? 'HISTORY' : 'SETUP')}><ArrowLeft/></button>
        <h1 className="text-xl font-black">LAX LEDGER</h1>
        {gameState === 'LIVE' && <button onClick={endGame} className="bg-red-900 text-white px-3 py-1 text-xs">END</button>}
      </div>

      <div className="space-y-3 pb-20">
        {(selectedGame?.players || players).map((p, idx) => (
          <div key={p.id} className="bg-white border p-3 shadow-sm">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => !selectedGame && setPlayers(players.map(pl => pl.id === p.id ? {...pl, collapsed: !pl.collapsed} : pl))}>
              <div className="truncate"><span className="text-xs">#{p.number || '??'}</span> <span className="font-bold text-sm">{p.name || 'ADD NAME'}</span></div>
              {p.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
            {p.collapsed ? (
              <div className="flex gap-3 mt-2 overflow-x-auto text-[10px] font-bold">
                {POSITIONS[p.position].map(s => <span key={s}>{s.slice(0,2)}:{p.stats[s]}</span>)}
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t">
                 {/* ... input/stat logic remains same for editing if not selectedGame ... */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
