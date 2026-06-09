import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Trash2, Plus, Users, Save, Check } from 'lucide-react';

const POSITIONS = {
  MIDFIELD: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'DRAWS', 'TO'],
  ATTACK: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  DEFENSE: ['SHOTS', 'GOALS', 'ASSISTS', 'GB', 'TO'],
  GOALIE: ['SHOTS', 'SAVES', 'GB', 'INTERCEPTIONS']
};

const App = () => {
  const [gameState, setGameState] = useState('MAIN');
  const [teams, setTeams] = useState(() => JSON.parse(localStorage.getItem('lax-teams') || '[]'));
  const [pastGames, setPastGames] = useState(() => JSON.parse(localStorage.getItem('lax-history') || '[]'));
  const [activeTeam, setActiveTeam] = useState(null);
  const [activePlayers, setActivePlayers] = useState([]);

  const saveTeam = (team) => {
    const updated = teams.find(t => t.id === team.id) 
      ? teams.map(t => t.id === team.id ? team : t) 
      : [...teams, { ...team, id: Date.now() }];
    setTeams(updated);
    localStorage.setItem('lax-teams', JSON.stringify(updated));
  };

  const deleteTeam = (id) => {
    const updated = teams.filter(t => t.id !== id);
    setTeams(updated);
    localStorage.setItem('lax-teams', JSON.stringify(updated));
  };

  const startGame = (team) => {
    setActiveTeam(team);
    setActivePlayers(team.players.map(p => ({ ...p, stats: { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0, SAVES: 0, INTERCEPTIONS: 0 } })));
    setGameState('LIVE');
  };

  const getTeamTotals = () => {
    let shots = 0, saves = 0, shotsAgainst = 0;
    const totals = { SHOTS: 0, GOALS: 0, ASSISTS: 0, GB: 0, DRAWS: 0, TO: 0 };
    activePlayers.forEach(p => {
      if (p.position === 'GOALIE') { shotsAgainst += p.stats.SHOTS; saves += p.stats.SAVES; } 
      else { shots += p.stats.SHOTS; }
      Object.entries(p.stats).forEach(([k, v]) => { if (totals.hasOwnProperty(k)) totals[k] += v; });
    });
    return { ...totals, SHOTS: shots, SA: shotsAgainst, SV: shotsAgainst > 0 ? ((saves / shotsAgainst) * 100).toFixed(0) + '%' : '0%' };
  };

  const totals = getTeamTotals();

  if (gameState === 'MAIN') return (
    <div className="p-6 bg-[#F9F7F2] min-h-screen text-[#2D3436]">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">LAX LEDGER – FIELD</h1>
      <button onClick={() => setGameState('SETUP')} className="w-full bg-[#2D3436] text-white py-4 font-bold mb-4">START GAME</button>
      <button onClick={() => setGameState('TEAMS')} className="w-full bg-[#E8E4DC] py-4 font-bold mb-4">MANAGE TEAMS</button>
    </div>
  );

  if (gameState === 'TEAMS') return (
    <div className="p-4 bg-[#F9F7F2] min-h-screen">
      <div className="flex justify-between mb-6 items-center"><button onClick={() => setGameState('MAIN')}><ArrowLeft/></button> <h1 className="font-black">TEAMS</h1> <button onClick={() => { setActiveTeam({name: '', players: []}); setGameState('EDIT_TEAM'); }}><Plus/></button></div>
      {teams.map(t => (
        <div key={t.id} className="p-4 bg-white border mb-2 flex justify-between font-bold">
            <span className="cursor-pointer" onClick={() => { setActiveTeam(t); setGameState('EDIT_TEAM'); }}>{t.name}</span>
            <button onClick={() => deleteTeam(t.id)} className="text-red-900"><Trash2/></button>
        </div>
      ))}
    </div>
  );

  if (gameState === 'EDIT_TEAM') return (
    <div className="p-4 bg-[#F9F7F2] min-h-screen">
        <label className="text-[10px] font-bold">TEAM NAME</label>
        <input className="w-full p-2 mb-4 font-bold text-lg border uppercase" placeholder="TEAM NAME" value={activeTeam.name} onChange={e => setActiveTeam({...activeTeam, name: e.target.value})} />
        <div className="flex text-[9px] font-bold mb-1 gap-2 px-1">
            <span className="w-12">#</span><span className="flex-1">NAME</span><span className="w-20">POS</span>
        </div>
        {activeTeam.players.map((p, i) => (
            <div key={i} className="flex gap-1 mb-2 items-center">
                <input className="w-12 p-2 border text-sm uppercase" value={p.number} onChange={e => { const ps = [...activeTeam.players]; ps[i].number = e.target.value; setActiveTeam({...activeTeam, players: ps})}} />
                <input className="flex-1 p-2 border text-sm uppercase" autoCapitalize="characters" value={p.name} onChange={e => { const ps = [...activeTeam.players]; ps[i].name = e.target.value; setActiveTeam({...activeTeam, players: ps})}} />
                <select className="border text-[10px] w-20 p-2" value={p.position} onChange={e => { const ps = [...activeTeam.players]; ps[i].position = e.target.value; setActiveTeam({...activeTeam, players: ps})}}>{Object.keys(POSITIONS).map(pos => <option key={pos} value={pos}>{pos}</option>)}</select>
                <button onClick={() => setActiveTeam({...activeTeam, players: activeTeam.players.filter((_, idx) => idx !== i)})}><Trash2 size={16} className="text-red-800"/></button>
            </div>
        ))}
        <button className="w-full p-2 border-2 border-dashed mt-2 font-bold text-sm" onClick={() => setActiveTeam({...activeTeam, players: [...activeTeam.players, {number:'', name:'', position:'MIDFIELD'}]})}>+ ADD PLAYER</button>
        <button className="w-full bg-[#2D3436] text-white p-4 mt-6 font-bold" onClick={() => { saveTeam(activeTeam); setGameState('TEAMS'); }}>SAVE TEAM</button>
    </div>
  );

  if (gameState === 'SETUP') return (
    <div className="p-6 bg-[#F9F7F2] min-h-screen">
      <button onClick={() => setGameState('MAIN')}><ArrowLeft/></button>
      <h1 className="font-black mt-4 mb-6">SELECT TEAM</h1>
      {teams.map(t => <button key={t.id} onClick={() => startGame(t)} className="w-full p-4 bg-white border mb-2 font-bold text-left">{t.name}</button>)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-4 uppercase text-[#2D3436]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState('MAIN')}><ArrowLeft/></button>
        <h1 className="font-black text-sm">LAX LEDGER – FIELD</h1>
        <button onClick={() => { saveTeam({ ...activeTeam, players: activePlayers }); alert('ROSTER SAVED!'); }} className="bg-[#E8E4DC] p-1"><Save size={18}/></button>
      </div>
      <div className="bg-[#2D3436] text-white p-3 mb-4 rounded-sm text-[10px] font-bold overflow-x-auto flex gap-3">
        {Object.entries(totals).map(([k, v]) => <span key={k}>{k}:{v}</span>)}
      </div>
      <div className="space-y-3 pb-20">
        {activePlayers.map((p, idx) => (
          <div key={idx} className="bg-white border p-3">
            <div className="flex justify-between font-bold text-sm" onClick={() => setActivePlayers(activePlayers.map((pl, i) => i === idx ? {...pl, collapsed: !pl.collapsed} : pl))}>
                <span>#{p.number} {p.name}</span> {p.collapsed ? <ChevronDown/> : <ChevronUp/>}
            </div>
            {!p.collapsed && (
                <div className="flex overflow-x-auto gap-1 mt-3">
                    {POSITIONS[p.position].map(s => (
                        <div key={s} className="flex flex-col items-center min-w-[50px]">
                            <span className="text-[7px]">{s}</span>
                            <button className="bg-[#2D3436] text-white w-full" onClick={() => setActivePlayers(activePlayers.map((pl, i) => i === idx ? {...pl, stats: {...pl.stats, [s]: pl.stats[s]+1}} : pl))}>+</button>
                            <div className="border w-full text-center font-bold text-sm">{p.stats[s]}</div>
                            <button className="bg-[#2D3436] text-white w-full" onClick={() => setActivePlayers(activePlayers.map((pl, i) => i === idx ? {...pl, stats: {...pl.stats, [s]: Math.max(0, pl.stats[s]-1)}} : pl))}>-</button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
