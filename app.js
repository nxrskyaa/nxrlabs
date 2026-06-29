/* ============================================================
   NXR GLYPH OS — interactions + Glyph LED animation
   ============================================================ */

/* ---------- BOOT ---------- */
window.addEventListener('load', () => {
  setTimeout(() => { const b = document.getElementById('boot'); if (b) b.style.display = 'none'; }, 2400);
});

/* ---------- HUD CLOCK + SCROLL % ---------- */
function pad(n){ return String(n).padStart(2,'0'); }
setInterval(() => {
  const d = new Date();
  const el = document.getElementById('hud-clock');
  if (el) el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}, 1000);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = Math.round((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) || 0;
  const el = document.getElementById('hud-scroll');
  if (el) el.textContent = String(pct).padStart(3,'0') + '%';
});

/* ---------- TYPEWRITER ---------- */
const typePhrases = [
  '> deploying onchain AI agents...',
  '> verifiable inference via TEE precompiles',
  '> ship it, polish it, make it feel alive',
  '> wagmi + viem + next.js // web3 native',
  '> 31 repos // 12 live dApps // 0 chill'
];
let tpI = 0, tpC = 0, tpDel = false;
function typeLoop(){
  const el = document.getElementById('typetext');
  if (!el) return;
  const cur = typePhrases[tpI];
  if (!tpDel){
    el.textContent = cur.slice(0, ++tpC);
    if (tpC === cur.length){ tpDel = true; setTimeout(typeLoop, 1900); return; }
  } else {
    el.textContent = cur.slice(0, --tpC);
    if (tpC === 0){ tpDel = false; tpI = (tpI+1) % typePhrases.length; }
  }
  setTimeout(typeLoop, tpDel ? 28 : 52);
}
typeLoop();

/* ============================================================
   GLYPH LED MATRIX — the signature Nothing animation.
   A grid of LED dots; concentric ring + sweeping pulses light
   up like the Glyph Interface on the back of a Nothing Phone.
   ============================================================ */
(function(){
  const canvas = document.getElementById('glyph-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], DPR = Math.min(window.devicePixelRatio || 1, 2);
  const GAP = 22;                // spacing between LEDs
  const R = 1.6;                 // dot radius
  const RED = [215, 25, 33];

  function build(){
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    dots = [];
    const cx = W * 0.55, cy = H * 0.5;
    for (let y = GAP/2; y < H; y += GAP){
      for (let x = GAP/2; x < W; x += GAP){
        const dx = x - cx, dy = y - cy;
        dots.push({ x, y, d: Math.sqrt(dx*dx + dy*dy), a: Math.atan2(dy, dx) });
      }
    }
  }

  let t = 0;
  function frame(){
    t += 0.016;
    ctx.clearRect(0,0,W,H);
    const cx = W * 0.55, cy = H * 0.5;

    // expanding ring pulses (like Glyph light-up)
    const ring1 = (t * 90) % 420;
    const ring2 = (t * 90 + 210) % 420;

    for (const dot of dots){
      let lit = 0.05;                                  // base ambient

      // concentric ring sweeps
      const e1 = Math.abs(dot.d - ring1);
      const e2 = Math.abs(dot.d - ring2);
      if (e1 < 26) lit = Math.max(lit, (1 - e1/26) * 0.9);
      if (e2 < 26) lit = Math.max(lit, (1 - e2/26) * 0.5);

      // rotating angular sweep (a "scanner" arm)
      const arm = (t * 0.9) % (Math.PI * 2);
      let da = Math.abs(((dot.a + Math.PI*2) % (Math.PI*2)) - arm);
      if (da > Math.PI) da = Math.PI*2 - da;
      if (da < 0.32 && dot.d > 40) lit = Math.max(lit, (1 - da/0.32) * 0.7);

      // soft breathing core
      const breathe = (Math.sin(t*1.6) + 1) / 2;
      if (dot.d < 70) lit = Math.max(lit, breathe * 0.6 * (1 - dot.d/70));

      // colour: red signal near ring fronts, white elsewhere
      const redness = Math.max(
        e1 < 18 ? (1 - e1/18) : 0,
        dot.d < 36 ? (1 - dot.d/36) : 0
      );
      let r, g, b;
      if (redness > 0.15){
        r = Math.round(RED[0]*redness + 232*(1-redness));
        g = Math.round(RED[1]*redness + 232*(1-redness));
        b = Math.round(RED[2]*redness + 232*(1-redness));
      } else { r = g = b = 232; }

      ctx.globalAlpha = lit;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, lit > 0.5 ? R + 0.7 : R, 0, Math.PI*2);
      ctx.fill();

      // glow for the brightest
      if (lit > 0.7){
        ctx.globalAlpha = (lit - 0.7) * 0.5;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, R + 4, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  build();
  window.addEventListener('resize', build);
  requestAnimationFrame(frame);
})();

/* ---------- REPOS ---------- */
const repos = [
  {n:"CONSTUAL",d:"",l:"TypeScript",f:false,u:"2H AGO"},
  {n:"ritual-chain-workshop",d:"On-chain AI bounty judge on Ritual",l:"TypeScript",f:true,u:"1D AGO"},
  {n:"RialoTempleAgent",d:"",l:"TypeScript",f:false,u:"2D AGO"},
  {n:"alodoc-consult",d:"",l:"TypeScript",f:false,u:"10D AGO"},
  {n:"ritual-agent-feeds",d:"Onchain message feed on Ritual Testnet",l:"TypeScript",f:false,u:"JUN 14"},
  {n:"Nxrskyaa-fable",d:"",l:"TypeScript",f:false,u:"JUN 13"},
  {n:"NxrLabsFableTest",d:"NXRSkyaa Labs SaaS landing page",l:"TypeScript",f:false,u:"JUN 13"},
  {n:"NXRSkyaa-Labs",d:"",l:"TypeScript",f:false,u:"JUN 12"},
  {n:"heaggy",d:"",l:"—",f:false,u:"JUN 04"},
  {n:"Arcsight",d:"",l:"—",f:false,u:"JUN 01"},
  {n:"Arcynite-Game",d:"",l:"TypeScript",f:false,u:"MAY 24"},
  {n:"Arctective",d:"",l:"TypeScript",f:false,u:"MAY 23"},
  {n:"rialoball",d:"gabut game",l:"HTML",f:false,u:"MAY 22"},
  {n:"DashboardNXR",d:"",l:"—",f:false,u:"MAY 19"},
  {n:"arcynite",d:"Arc Testnet onboarding game MVP",l:"TypeScript",f:false,u:"MAY 18"},
  {n:"nxrskyaa",d:"Profile README",l:"—",f:false,u:"MAY 18"},
  {n:"siggy-scroll",d:"Gamified Ritual Testnet onboarding",l:"—",f:false,u:"MAY 17"},
  {n:"tennis-rally-arc",d:"Arcade tennis on Arc Testnet",l:"TypeScript",f:false,u:"MAY 16"},
  {n:"rialotemple",d:"alpha build",l:"TypeScript",f:false,u:"MAY 15"},
  {n:"CVGEN",d:"Web3 CV generator",l:"TypeScript",f:false,u:"MAY 12"},
  {n:"alternite-rialo",d:"early phase building",l:"TypeScript",f:false,u:"MAY 12"},
  {n:"agenticonchainritual",d:"Replic Version",l:"TypeScript",f:false,u:"MAY 11"},
  {n:"ritualarenafeeds",d:"",l:"TypeScript",f:false,u:"MAY 09"},
  {n:"ritualagenticfeeds",d:"",l:"TypeScript",f:false,u:"MAY 09"},
  {n:"agentfeeds",d:"",l:"TypeScript",f:false,u:"MAY 09"},
  {n:"ritualagentic",d:"",l:"TypeScript",f:false,u:"MAY 09"},
  {n:"gritual",d:"Ritual testnet explorer viz",l:"TypeScript",f:false,u:"MAY 08"},
  {n:"NXRScreener",d:"Crypto smart money screener",l:"TypeScript",f:false,u:"MAY 08"},
  {n:"nxrpulse",d:"Crypto helper build",l:"HTML",f:false,u:"MAY 07"},
  {n:"ritualtennisonchain",d:"Ritual Tennis Onchain by NXR",l:"TypeScript",f:false,u:"MAY 07"},
  {n:"ritualtestnetdapps",d:"Ritual Testnet dApps Explorer",l:"TypeScript",f:false,u:"MAY 06"},
];
const rl = document.getElementById('repo-list');
repos.forEach((r,i) => {
  const a = document.createElement('a');
  a.className = 'repo';
  a.href = `https://github.com/nxrskyaa/${r.n}`;
  a.target = '_blank';
  a.innerHTML = `<span class="ri">${String(i+1).padStart(2,'0')}</span><span class="rn">${r.n}${r.f?'<span class="fk">FORK</span>':''}</span><span class="rd">${r.d||'—'}</span><span class="rl">${r.l}</span><span class="ru">${r.u}</span>`;
  rl.appendChild(a);
});

/* ---------- PROJECTS ---------- */
const projects = [
  {n:"Tennis Rally Arc",s:"★ 0",d:"Arcade tennis rally on Arc Testnet — playable without wallet, score submit with injected wallet.",st:["Next.js","wagmi","viem","Arc"],links:[["SOURCE","https://github.com/nxrskyaa/tennis-rally-arc",1]]},
  {n:"Ritual Agent Terminal",s:"★ 0",d:"Onchain message feed on Ritual Testnet — real-time agent communication.",st:["Next.js","TypeScript","Ritual"],links:[["LIVE","https://ritual-agent-feeds.vercel.app",1],["CODE","https://github.com/nxrskyaa/ritual-agent-feeds",0]]},
  {n:"CVGEN",s:"★ 0",d:"Web3 CV generator — onchain-native resumes with verified identity.",st:["Next.js","Tailwind"],links:[["LIVE","https://cvgen-five.vercel.app",1],["CODE","https://github.com/nxrskyaa/CVGEN",0]]},
  {n:"Rialo Temple Agent",s:"★ 0",d:"Onchain agent integration for Rialo — connecting contracts to offchain APIs.",st:["Next.js","Rialo"],links:[["LIVE","https://rialo-temple-agent.vercel.app",1],["CODE","https://github.com/nxrskyaa/RialoTempleAgent",0]]},
  {n:"Arcynite",s:"★ 0",d:"Colorful Arc Testnet onboarding game — gamified chain education MVP.",st:["TypeScript","Arc"],links:[["LIVE","https://arcynitegame.vercel.app",1],["CODE","https://github.com/nxrskyaa/Arcynite-Game",0]]},
  {n:"gritual",s:"★ 0",d:"Ritual Testnet explorer — visualization tool for onchain data.",st:["TypeScript","Ritual"],links:[["LIVE","https://gritual-explorer.vercel.app",1],["CODE","https://github.com/nxrskyaa/gritual",0]]},
  {n:"CONSTUAL",s:"★ 7",d:"Latest build — actively shipping. Updated within hours.",st:["TypeScript"],links:[["CODE","https://github.com/nxrskyaa/CONSTUAL",1]]},
  {n:"Arctective",s:"★ 0",d:"Arc Testnet detective game — interactive onchain investigation.",st:["TypeScript","Arc"],links:[["LIVE","https://arctective.vercel.app",1],["CODE","https://github.com/nxrskyaa/Arctective",0]]},
];
const pg = document.getElementById('pgrid');
projects.forEach(p => {
  const c = document.createElement('div');
  c.className = 'pcard gframe reveal';
  const links = p.links.map(l => `<a href="${l[1]}" target="_blank" class="plink${l[2]?' pri':''}">${l[0]}</a>`).join('');
  c.innerHTML = `<span class="bar-top"></span><div class="ph"><span class="pn">${p.n}</span><span class="ps">${p.s}</span></div><div class="pd">${p.d}</div><div class="pstack">${p.st.map(s=>`<span>${s}</span>`).join('')}</div><div class="plinks">${links}</div>`;
  pg.appendChild(c);
});

/* ---------- STAT BARS + COUNTERS ---------- */
document.querySelectorAll('.bar').forEach(bar => {
  const on = +bar.dataset.on, max = +bar.dataset.max, red = bar.dataset.red === '1';
  for (let i=0;i<max;i++){
    const seg = document.createElement('i');
    if (i < on) seg.className = (red && i === on-1) ? 'on red' : 'on';
    bar.appendChild(seg);
  }
});
const co = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    const unit = el.querySelector('.u')?.outerHTML || '';
    let cur = 0, step = Math.max(1, Math.ceil(target/40));
    const iv = setInterval(() => {
      cur += step; if (cur >= target){ cur = target; clearInterval(iv); }
      el.innerHTML = cur + unit;
    }, 28);
    co.unobserve(el);
  });
}, {threshold:0.5});
document.querySelectorAll('.v[data-target]').forEach(v => co.observe(v));

/* ---------- SCROLL REVEAL ---------- */
const ro = new IntersectionObserver((es) => {
  es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ---------- NAV ACTIVE ---------- */
const navLinks = document.querySelectorAll('.nav-links a');
const no = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  });
}, {rootMargin:'-25% 0px -60% 0px'});
document.querySelectorAll('section[id]').forEach(s => no.observe(s));
