const petalsEl = document.getElementById('petals');
function createPetal(){
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random()*100 + 'vw';
  p.style.animationDuration = (9 + Math.random()*6) + 's';
  p.style.width = p.style.height = (7 + Math.random()*6) + 'px';
  petalsEl.appendChild(p);
  setTimeout(()=>p.remove(), 16000);
}
for(let i=0;i<10;i++) setTimeout(createPetal, i*500);
setInterval(createPetal, 4200);

const firefliesEl = document.getElementById('fireflies');
let fireflyInterval = null;
function createFirefly(){
  const f = document.createElement('div');
  f.className = 'firefly';
  f.style.left = Math.random()*100 + 'vw';
  f.style.top = Math.random()*100 + 'vh';
  f.style.animationDuration = (8 + Math.random()*5) + 's';
  firefliesEl.appendChild(f);
  setTimeout(()=>f.remove(), 12000);
}
function startFireflies(){
  if(fireflyInterval) return;
  for(let i=0;i<5;i++) setTimeout(createFirefly, i*900);
  fireflyInterval = setInterval(createFirefly, 5200);
}

const bouquetPalette = {
  blooms:[
    {c:'#f0cdd9', sizes:[26,30,24]},
    {c:'#7c6293', sizes:[20,18]},
    {c:'#c79a4d', sizes:[16,14]},
  ],
  leaf:'#7e9468', ribbon:'#8a3052'
};
function buildBouquet(container, scale=1){
  const svg = document.createElement('div');
  svg.className = 'bouquet';
  const stems = [
    {x:74, y:40, h:120, rot:0},
    {x:60, y:55, h:96, rot:-8},
    {x:90, y:55, h:96, rot:9},
  ];
  let html = '';
  stems.forEach((s,i)=>{
    html += `<div class="stem" style="left:${s.x}px; top:${s.y}px; height:${s.h}px; transform:rotate(${s.rot}deg); transform-origin:bottom;"></div>`;
  });
  html += `<div class="ribbon" style="left:64px; top:140px;"></div>`;
  html += `<div class="leaf" style="left:38px; top:100px; transform:rotate(-30deg); background:${bouquetPalette.leaf};"></div>`;
  html += `<div class="leaf" style="left:96px; top:108px; transform:rotate(35deg) scaleX(-1); background:${bouquetPalette.leaf};"></div>`;
  const blooms = [
    {x:60, y:18, r:17, c:'#f0cdd9'},
    {x:80, y:6,  r:20, c:'#f0cdd9'},
    {x:100, y:20, r:16, c:'#f0cdd9'},
    {x:42, y:34, r:13, c:'#7c6293'},
    {x:116, y:36, r:13, c:'#c79a4d'},
    {x:80, y:30, r:8, c:'#e7cd9b'},
  ];
  blooms.forEach(b=>{
    html += `<div class="bloom" style="left:${b.x-b.r}px; top:${b.y-b.r}px; width:${b.r*2}px; height:${b.r*2}px;
      background:radial-gradient(circle at 32% 30%, #fff8, ${b.c} 60%, ${b.c}cc 100%);
      box-shadow:0 3px 8px rgba(43,28,44,.12);"></div>`;
  });
  svg.innerHTML = html;
  container.appendChild(svg);
}
document.querySelectorAll('#screen-box, #screen-mail, #screen-messages').forEach(s=>{
  buildBouquet(s);
});

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>{
    s.classList.remove('active');
    if(s.id !== id) setTimeout(()=>{ s.style.display='none'; }, 650);
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  setTimeout(()=>el.classList.add('active'), 20);
  if(id === 'screen-messages') startFireflies();
}

function spawnConfetti(anchor){
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  const colors = ['#b6486c','#c79a4d','#7c6293','#f0cdd9','#8a3052'];
  for(let i=0;i<28;i++){
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const angle = (i/28)*Math.PI*2;
    const v = 120 + Math.random()*200;
    c.style.left = cx+'px'; c.style.top = cy+'px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.width = c.style.height = (5+Math.random()*8)+'px';
    c.style.animationDelay = (Math.random()*.3)+'s';
    c.style.setProperty('--tx', (Math.cos(angle)*v)+'px');
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 3000);
  }
}
function spawnHearts(anchor){
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  for(let i=0;i<5;i++){
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = '❤️';
    h.style.left = (cx + (Math.random()-0.5)*90)+'px';
    h.style.top = cy+'px';
    h.style.animationDelay = (i*.12)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 4000);
  }
}

function openBox(){
  const box = document.getElementById('giftBox');
  spawnConfetti(box); spawnHearts(box);
  const music = document.getElementById('bgMusic');
  if (music) music.play();
  setTimeout(()=>showScreen('screen-mail'), 950);
}
function openEnvelope(){
  const env = document.getElementById('envelopeEl');
  spawnConfetti(env); spawnHearts(env);
  setTimeout(()=>showScreen('screen-messages'), 900);
}
function goBack(){ showScreen('screen-box'); }

['giftBox','envelopeEl'].forEach(id=>{
  document.getElementById(id).addEventListener('keypress', e=>{
    if(e.key==='Enter' || e.key===' '){ document.getElementById(id).click(); }
  });
});

document.getElementById('screen-box').style.display = 'flex';

const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in-view'); revealObserver.unobserve(e.target); }
  });
}, { threshold:.3 });
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
