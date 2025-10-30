
async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('No se pudo cargar '+path);
  return await res.json();
}

// Compute standings from matches
function computeTable(teams, matches){
  const table = {};
  teams.forEach(t=>{
    table[t.name]={team:t.name, PJ:0, G:0, E:0, P:0, GF:0, GC:0, DG:0, PTS:0};
  });
  matches.forEach(m=>{
    if(m.goals_home==null || m.goals_away==null) return;
    const home = table[m.home], away = table[m.away];
    home.PJ++; away.PJ++;
    home.GF+=m.goals_home; home.GC+=m.goals_away;
    away.GF+=m.goals_away; away.GC+=m.goals_home;
    if(m.goals_home>m.goals_away){ home.G++; home.PTS+=3; away.P++; }
    else if(m.goals_home<m.goals_away){ away.G++; away.PTS+=3; home.P++; }
    else { home.E++; away.E++; home.PTS+=1; away.PTS+=1; }
  });
  Object.values(table).forEach(r=> r.DG = r.GF - r.GC);
  return Object.values(table).sort((a,b)=>{
    if(b.PTS!==a.PTS) return b.PTS-a.PTS;
    if(b.DG!==a.DG) return b.DG-a.DG;
    if(b.GF!==a.GF) return b.GF-a.GF;
    return a.team.localeCompare(b.team);
  });
}

function renderTable(rows, el){
  const thead = `<thead><tr>
    <th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th>
  </tr></thead>`;
  const tbody = rows.map((r,i)=>`<tr>
    <td>${i+1}</td><td>${r.team}</td><td>${r.PJ}</td><td>${r.G}</td><td>${r.E}</td><td>${r.P}</td>
    <td>${r.GF}</td><td>${r.GC}</td><td>${r.DG}</td><td><b>${r.PTS}</b></td>
  </tr>`).join('');
  el.innerHTML = `<table class="table">${thead}<tbody>${tbody}</tbody></table>`;
}

async function initTable(){
  const teams = await loadJSON('data/equipos.json');
  const matches = await loadJSON('data/partidos.json');
  const rows = computeTable(teams, matches);
  const mount = document.getElementById('tabla-mount');
  if(mount) renderTable(rows, mount);
}

async function renderFixtures(){
  const matches = await loadJSON('data/partidos.json');
  const eq = await loadJSON('data/equipos.json');
  const byDate = matches.reduce((acc,m)=>{
    const d = m.date || 'Sin fecha';
    if(!acc[d]) acc[d]=[];
    acc[d].push(m); return acc;
  },{});
  const container = document.getElementById('fixtures-mount');
  if(!container) return;
  let html = '';
  Object.keys(byDate).sort().forEach(d=>{
    html += `<h3>${d}</h3><div class="card">`;
    html += '<table class="table"><thead><tr><th>Hora</th><th>Local</th><th></th><th>Visitante</th><th>Sede</th></tr></thead><tbody>';
    byDate[d].forEach(m=>{
      const score = (m.goals_home==null||m.goals_away==null) ? 'vs' : `${m.goals_home} - ${m.goals_away}`;
      html += `<tr><td>${m.time||''}</td><td>${m.home}</td><td><b>${score}</b></td><td>${m.away}</td><td>${m.venue||''}</td></tr>`;
    });
    html += '</tbody></table></div>';
  });
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTable();
  renderFixtures();
});
