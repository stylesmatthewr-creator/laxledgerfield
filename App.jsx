import React, { useState, useEffect } from 'react'; 

import { Plus, Minus, Download, UserPlus, Trash2 } from 'lucide-react'; 


const LacrosseTracker = () => { 

// Load data from localStorage or default to 15 empty slots 

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



Game Tracker


Export CSV 










{['Shots', 'Goals', 'GB', 'Draws', 'CTO'].map(s => )} 




{players.map((player, idx) => ( 




{Object.keys(player.stats).map((stat) => ( 


))} 


))} 


#	Name	{s}
{player.number} { 

const newP = [...players]; newP[idx].number = e.target.value; setPlayers(newP); 

}} />	{player.name} { 

const newP = [...players]; newP[idx].name = e.target.value; setPlayers(newP); 

}} />	

updateStat(player.id, stat, -1)} className="bg-slate-700 p-1 rounded hover:bg-red-900"> 

{player.stats[stat]} 

updateStat(player.id, stat, 1)} className="bg-amber-600 p-1 rounded hover:bg-amber-500"> 





); 

}; 


export default LacrosseTracker; 
