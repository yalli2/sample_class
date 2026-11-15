/* =========================================================
   다인에듀 기초 스페인어 문법 — 학습 엔진 (app.js)
   ========================================================= */
(function(){
'use strict';

/* ---------- 챕터 목록 ---------- */
const CHAPTERS = [
  {id:'00', title:'스페인어의 이해', sub:'Introducción', icon:'🌍', part:0},
  {id:'01', title:'발음 및 강세', sub:'Pronunciación y acento', icon:'🔤', part:0},
  {id:'02', title:'숫자 및 달력', sub:'Números y calendario', icon:'🔢', part:0},
  {id:'03', title:'시간 읽기', sub:'La hora', icon:'🕒', part:0},
  {id:'04', title:'스페인어 기본표현', sub:'Expresiones básicas', icon:'💬', part:0},
  {id:'05', title:'명사 – 성과 수', sub:'Sustantivo: género y número', icon:'🧩', part:1},
  {id:'06', title:'관사', sub:'Artículos', icon:'🏷️', part:1},
  {id:'07', title:'형용사', sub:'Adjetivos', icon:'🎨', part:1},
  {id:'08', title:'동사 I – Ser & Estar', sub:'Ser y Estar', icon:'⚖️', part:1},
  {id:'09', title:'동사 II – 규칙동사', sub:'Verbos regulares', icon:'🔁', part:1},
  {id:'10', title:'동사 III – 불규칙동사', sub:'Verbos irregulares', icon:'🌀', part:1},
  {id:'11', title:'의문문과 감탄문', sub:'Interrogativos y exclamativos', icon:'❓', part:1},
  {id:'12', title:'비교급과 최상급', sub:'Comparativos y superlativos', icon:'📏', part:1},
  {id:'13', title:'직설법 과거', sub:'Pretérito indefinido', icon:'⏪', part:2},
  {id:'14', title:'불완료 과거', sub:'Pretérito imperfecto', icon:'🎞️', part:2},
  {id:'15', title:'직설법 과거 vs 불완료 과거', sub:'Indefinido vs Imperfecto', icon:'🆚', part:2},
  {id:'16', title:'현재완료시제', sub:'Pretérito perfecto', icon:'✅', part:2},
  {id:'17', title:'현재완료 vs 직설법 과거', sub:'Perfecto vs Indefinido', icon:'🔀', part:2},
  {id:'18', title:'미래시제', sub:'Futuro', icon:'🚀', part:2},
  {id:'19', title:'현재분사', sub:'Gerundio', icon:'🏃', part:2},
  {id:'20', title:'규칙동사의 명령형', sub:'Imperativo regular', icon:'📣', part:3},
  {id:'21', title:'불규칙동사의 명령형', sub:'Imperativo irregular', icon:'📢', part:3},
  {id:'22', title:'동사의 관용표현', sub:'Perífrasis verbales', icon:'🔗', part:3},
  {id:'23', title:'부사', sub:'Adverbios', icon:'🧭', part:4},
  {id:'24', title:'접속사', sub:'Conjunciones', icon:'🔗', part:4},
  {id:'25', title:'전치사 – 시간', sub:'Preposiciones de tiempo', icon:'⏰', part:4},
  {id:'26', title:'전치사 – 움직임·방향', sub:'Preposiciones de movimiento', icon:'🧳', part:4},
  {id:'27', title:'전치사 – 위치', sub:'Preposiciones de lugar', icon:'📍', part:4},
  {id:'28', title:'전치사 – a, de, en', sub:'a / de / en / sobre', icon:'🧷', part:4},
  {id:'29', title:'전치사 – para, por, con, sin, contra', sub:'para / por / con / sin', icon:'🎯', part:4},
  {id:'30', title:'참고자료 & 동사변화 연습장', sub:'Recursos y práctica de verbos', icon:'📚', part:5},
];
const PARTS = [
  {name:'Parte 1 · 입문', tag:'기초 다지기', desc:'스페인어의 배경, 발음, 숫자, 시간, 기본 회화 표현'},
  {name:'Parte 2 · 품사의 기초', tag:'명사부터 동사까지', desc:'명사·관사·형용사와 현재시제 동사, 의문문, 비교급'},
  {name:'Parte 3 · 동사의 시제', tag:'과거·완료·미래', desc:'직설법 과거, 불완료 과거, 현재완료, 미래, 현재분사'},
  {name:'Parte 4 · 명령형과 관용표현', tag:'말하기 확장', desc:'명령형과 ir a, tener que, soler 등 동사 관용표현'},
  {name:'Parte 5 · 부사·접속사·전치사', tag:'문장 연결', desc:'부사의 종류, 접속사, 전치사 집중 학습'},
  {name:'Parte 6 · 참고자료 & 연습장', tag:'복습', desc:'학습 사이트 소개와 동사변화 무한 연습장'},
];

/* ---------- 유틸 ---------- */
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];
const el = (tag, cls, html)=>{const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e;};
const shuffle = a=>{a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
const rnd = (a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick = a=>a[Math.floor(Math.random()*a.length)];
const strip = s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
const norm = s=>(s||'').toLowerCase().trim().replace(/[¿?¡!.,;:]/g,'').replace(/\s+/g,' ');
function check(user, answers){
  const u = norm(user); if(!u) return 'empty';
  const arr = Array.isArray(answers)?answers:[answers];
  for(const a of arr){ if(norm(a)===u) return 'ok'; }
  for(const a of arr){ if(strip(norm(a))===strip(u)) return 'near'; }
  return 'ng';
}
function toast(msg){
  let t=$('.toast'); if(!t){t=el('div','toast'); document.body.appendChild(t);}
  t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2200);
}
function confetti(n=80){
  const colors=['#d7263d','#f4b942','#2457c5','#1f9d6a','#7b4fd6'];
  for(let i=0;i<n;i++){
    const c=el('div','confetti'); c.style.left=Math.random()*100+'vw'; c.style.background=pick(colors);
    c.style.animationDuration=(1.6+Math.random()*1.6)+'s'; c.style.animationDelay=(Math.random()*.4)+'s';
    c.style.borderRadius=Math.random()>.5?'50%':'2px'; document.body.appendChild(c); setTimeout(()=>c.remove(),3500);
  }
}

/* ---------- 진도 저장 ---------- */
const KEY='dbsg_progress_v1';
function loadP(){ try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};} }
function saveP(p){ try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){} }
function chProgress(id){ const p=loadP(); return p[id]||{done:[],best:0,visits:0}; }
function setDone(id, exIdx, total){
  const p=loadP(); const c=p[id]||{done:[],best:0,visits:0};
  if(!c.done.includes(exIdx)) c.done.push(exIdx); c.total=total; p[id]=c; saveP(p);
  updateHeaderProgress();
}
function setBest(id, score){ const p=loadP(); const c=p[id]||{done:[],best:0,visits:0}; c.best=Math.max(c.best||0,score); p[id]=c; saveP(p); }
function pct(id,total){ const c=chProgress(id); const t=total||c.total||1; return Math.min(100,Math.round((c.done.length/t)*100)); }

/* ---------- 테마 ---------- */
function initTheme(){
  const saved=localStorage.getItem('dbsg_theme'); if(saved) document.documentElement.dataset.theme=saved;
}
function toggleTheme(){
  const cur=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=cur; localStorage.setItem('dbsg_theme',cur);
}

/* ---------- TTS ---------- */
let voices=[]; let voiceES=null;
function loadVoices(){
  voices=speechSynthesis.getVoices();
  const pref=['Mónica','Monica','Paulina','Jorge','Google español','Microsoft Helena','Microsoft Laura','Elvira','Alvaro','Álvaro'];
  const es=voices.filter(v=>/^es/i.test(v.lang));
  voiceES = es.find(v=>pref.some(p=>v.name.includes(p))) || es.find(v=>v.lang==='es-ES') || es[0] || null;
}
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }
function speak(text, btn, rate){
  if(!('speechSynthesis' in window)){toast('이 브라우저는 음성을 지원하지 않습니다.');return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text.replace(/\(.*?\)/g,'').replace(/[_]/g,' '));
  u.lang='es-ES'; if(voiceES) u.voice=voiceES; u.rate=rate||0.92; u.pitch=1;
  if(btn){ btn.classList.add('playing'); u.onend=u.onerror=()=>btn.classList.remove('playing'); }
  speechSynthesis.speak(u);
}
function spk(text, sm){ const b=el('button','spk'+(sm?' sm':''),'🔊'); b.title='듣기'; b.onclick=e=>{e.stopPropagation(); speak(text,b);}; return b; }

/* ---------- 스페인어 숫자 ---------- */
const U=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
const T=['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
const H=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
function numToEs(n, fem){
  n=Math.floor(Math.abs(n));
  if(n===0) return 'cero';
  if(n>=1e9) return 'mil millones 이상은 지원하지 않습니다';
  const below1000=(x)=>{
    let s='';
    if(x===100) return 'cien';
    if(x>=100){ s+=H[Math.floor(x/100)]; x%=100; if(x) s+=' '; }
    if(x<30 && x>0){ s+=U[x]; }
    else if(x>=30){ s+=T[Math.floor(x/10)]; if(x%10) s+=' y '+U[x%10]; }
    return s;
  };
  let out=[];
  const mill=Math.floor(n/1e6), mil=Math.floor((n%1e6)/1000), rest=n%1000;
  if(mill){ out.push(mill===1?'un millón':below1000(mill)+' millones'); }
  if(mil){ out.push(mil===1?'mil':below1000(mil).replace(/uno$/,'un')+' mil'); }
  if(rest){ out.push(below1000(rest)); }
  let s=out.join(' ');
  if(fem) s=s.replace(/uno$/,'una').replace(/ientos/g,'ientas');
  return s;
}
const ORD=[['primero','1º'],['segundo','2º'],['tercero','3º'],['cuarto','4º'],['quinto','5º'],['sexto','6º'],['séptimo','7º'],['octavo','8º'],['noveno','9º'],['décimo','10º'],['undécimo','11º'],['duodécimo','12º'],['decimotercero','13º'],['decimocuarto','14º'],['decimoquinto','15º'],['decimosexto','16º'],['decimoséptimo','17º'],['decimoctavo','18º'],['decimonoveno','19º'],['vigésimo','20º'],['vigésimo primero','21º'],['trigésimo','30º'],['cuadragésimo','40º'],['quincuagésimo','50º'],['sexagésimo','60º'],['septuagésimo','70º'],['octogésimo','80º'],['nonagésimo','90º'],['centésimo','100º']];
const MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DAYS=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

/* ---------- 시간 표현 ---------- */
function timeToEs(h24, m){
  let h=h24%12; if(h===0) h=12;
  const hourWord=(hh)=> hh===1?'la una':'las '+U[hh];
  let nextH=h%12+1;
  const main = (m===0) ? hourWord(h)+' en punto'
    : m===15 ? hourWord(h)+' y cuarto'
    : m===30 ? hourWord(h)+' y media'
    : m===45 ? hourWord(nextH)+' menos cuarto'
    : m<=30 ? hourWord(h)+' y '+numToEs(m)
    : hourWord(nextH)+' menos '+numToEs(60-m);
  let part = h24<6?'de la madrugada':h24<12?'de la mañana':h24<20?'de la tarde':'de la noche';
  if(m===0 && h24===12) part='del mediodía';
  if(m===0 && h24===0) part='de la noche';
  // 허용 답안
  const alts=new Set();
  const h2=hourWord(h), hn=hourWord(nextH);
  const verb = (hh)=>hh===1?'es ':'son ';
  const add=s=>{alts.add(s); alts.add(verb(s.startsWith('la una')?1:2)+s);};
  add(main);
  if(m===0){ add(h2); }
  if(m===15){ add(h2+' y quince'); }
  if(m===30){ add(h2+' y treinta'); }
  if(m===45){ add('el cuarto para '+hn); add(h2+' y cuarenta y cinco'); add(hn+' menos quince'); }
  if(m>30 && m!==45){ add(h2+' y '+numToEs(m)); add(numToEs(60-m)+' para '+hn); }
  if(m<30 && m!==0 && m!==15){ /* same */ }
  return {text:main, part, full:main+' '+part, alts:[...alts], verb:verb(main.startsWith('la una')?1:2).trim()};
}

/* ---------- 악센트 보조 버튼 ---------- */
let lastInput=null;
document.addEventListener('focusin',e=>{ if(e.target.matches('input[type=text], input.blank, input:not([type])')) lastInput=e.target; });
function accentBar(){
  const bar=el('div','accents');
  ['á','é','í','ó','ú','ñ','ü','¿','¡'].forEach(ch=>{
    const b=el('button',null,ch); b.type='button';
    b.onmousedown=e=>e.preventDefault();
    b.onclick=()=>{ if(!lastInput) return; const i=lastInput; const s=i.selectionStart||i.value.length; i.value=i.value.slice(0,s)+ch+i.value.slice(i.selectionEnd||s); i.focus(); i.setSelectionRange(s+1,s+1); };
    bar.appendChild(b);
  });
  return bar;
}

/* ---------- 섹션 렌더러 (학습) ---------- */
function esify(html){ // [[스페인어]] → 파란 굵은 글씨 + 스피커
  return html.replace(/\[\[(.+?)\]\]/g,(m,t)=>`<span class="es">${t}</span><button class="spk sm" data-say="${t.replace(/"/g,'&quot;')}">🔊</button>`)
             .replace(/==(.+?)==/g,'<mark class="hl">$1</mark>');
}
function bindSpk(root){ $$('[data-say]',root).forEach(b=>{ if(b._b) return; b._b=1; b.onclick=e=>{e.stopPropagation(); speak(b.dataset.say,b);} }); }

const SEC={
  text(s){ const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title)); d.appendChild(el('div',null,esify(s.html))); return d; },
  callout(s){ const em={tip:'💡',warn:'⚠️',info:'ℹ️',note:'📌'}[s.kind||'tip']; const d=el('div','callout '+(s.kind||'tip')); d.innerHTML=`<div class="em">${em}</div><div>${esify(s.html)}</div>`; return d; },
  table(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    const w=el('div','tbl-wrap'); const t=el('table','tbl');
    if(s.head) t.innerHTML='<thead><tr>'+s.head.map(h=>`<th>${h}</th>`).join('')+'</tr></thead>';
    const tb=el('tbody');
    s.rows.forEach(r=>{ const tr=el('tr'); r.forEach((c,i)=>{ const td=el('td'); const isEs=(s.es||[]).includes(i); td.innerHTML=esify(isEs?`<span class="es">${c}</span><button class="spk sm" data-say="${String(c).replace(/<.*?>/g,'').replace(/"/g,'&quot;')}">🔊</button>`:String(c)); if(i===0&&s.firstBold!==false) td.classList.add('s'); tr.appendChild(td); }); tb.appendChild(tr); });
    t.appendChild(tb); w.appendChild(t); d.appendChild(w);
    if(s.after) d.appendChild(el('div',null,esify(s.after)));
    return d;
  },
  examples(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    const l=el('div','ex-list');
    s.items.forEach(it=>{ const r=el('div','ex'); r.appendChild(spk(it.es)); const t=el('div','t'); t.innerHTML=`<span class="es">${it.es.replace(/==(.+?)==/g,'<mark class="hl">$1</mark>')}</span><span class="ko">${it.ko||''}</span>`; r.appendChild(t); l.appendChild(r); });
    d.appendChild(l); if(s.after) d.appendChild(el('div',null,esify(s.after))); return d;
  },
  cards(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    d.appendChild(el('p','ko','카드를 클릭하면 뒤집힙니다. 🔊 버튼으로 발음을 들어보세요.'));
    const g=el('div','cards');
    s.items.forEach(it=>{ const f=el('div','flip'); f.innerHTML=`<div class="in"><div class="f">${it.front}${it.fsub?`<small>${it.fsub}</small>`:''}</div><div class="b">${it.back}${it.note?`<small>${it.note}</small>`:''}</div></div>`; f.onclick=()=>f.classList.toggle('on'); const b=spk(it.say||it.front,true); b.style.position='absolute'; b.style.right='6px'; b.style.top='6px'; b.style.zIndex=2; f.style.position='relative'; f.appendChild(b); g.appendChild(f); });
    d.appendChild(g); return d;
  },
  chips(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    const g=el('div','chips');
    s.items.forEach(it=>{ const c=el('div','chip'); c.innerHTML=`<span class="es">${it[0]}</span><span class="ko">${it[1]}</span>`; c.onclick=()=>speak(it[0]); g.appendChild(c); });
    d.appendChild(g); return d;
  },
  compare(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    const c=el('div','cmp');
    s.cols.forEach((col,i)=>{ const x=el('div','col '+(i%2?'b':'a')); x.innerHTML=`<h4>${col.title}</h4>`+esify(col.html); c.appendChild(x); });
    d.appendChild(c); return d;
  },
  subtabs(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    const bar=el('div','subtabs'); const body=el('div');
    s.tabs.forEach((t,i)=>{ const b=el('button',i?'':'active',t.label); const p=el('div','subpanel'+(i?'':' active')); t.sections.forEach(ss=>p.appendChild(renderSection(ss))); b.onclick=()=>{ $$('button',bar).forEach(x=>x.classList.remove('active')); $$('.subpanel',body).forEach(x=>x.classList.remove('active')); b.classList.add('active'); p.classList.add('active'); }; bar.appendChild(b); body.appendChild(p); });
    d.appendChild(bar); d.appendChild(body); return d;
  },
  reveal(s){
    const d=el('div','sec'); if(s.title) d.appendChild(el('h3',null,s.title));
    if(s.html) d.appendChild(el('div',null,esify(s.html)));
    s.items.forEach(it=>{ const r=el('div','reveal'); r.innerHTML=`<div>${esify(it.q)} <small>(클릭하여 확인)</small></div><div class="ans">${esify(it.a)}</div>`; r.onclick=()=>r.classList.toggle('on'); d.appendChild(r); });
    return d;
  },
  widget(s){ const f=WIDGETS[s.name]; return f?f(s):el('div','sec','위젯을 불러올 수 없습니다: '+s.name); },
};
function renderSection(s){ const n=(SEC[s.type]||SEC.text)(s); bindSpk(n); return n; }

/* ---------- 위젯 ---------- */
const WIDGETS={};

/* 알파벳 */
WIDGETS.alphabet=function(s){
  const d=el('div','widget'); d.appendChild(el('h3',null,s.title||'🔤 알파벳 탐험 — 글자를 클릭해 발음을 들어보세요'));
  const out=el('div','bigout'); out.innerHTML='<span>글자를 선택하세요</span>'; d.appendChild(out);
  const g=el('div','alpha');
  s.items.forEach(it=>{ const L=el('div','letter'); L.innerHTML=`<b>${it.l}</b><small>${it.name}</small><em>${it.ko}</em>`; L.onclick=()=>{ $$('.letter',g).forEach(x=>x.classList.remove('active')); L.classList.add('active'); out.innerHTML=''; out.appendChild(spk(it.name)); out.appendChild(el('span',null,`${it.l} — <i>${it.name}</i> [${it.ko}] &nbsp;`)); it.words.forEach(w=>{ const c=el('span','chip'); c.innerHTML=`<span class="es">${w}</span>`; c.onclick=e=>{e.stopPropagation(); speak(w);}; out.appendChild(c); }); speak(it.name+'. '+it.words.join('. ')); }; g.appendChild(L); });
  d.appendChild(g); return d;
};

/* 숫자 변환기 + 퀴즈 */
WIDGETS.numbers=function(s){
  const d=el('div','widget'); d.appendChild(el('h3',null,'🔢 숫자 실험실 — 어떤 숫자든 스페인어로'));
  const modes=el('div','modes'); const body=el('div');
  const M=[['변환기',conv],['듣고 쓰기',listen],['보고 쓰기',write],['서수 카드',ordinals]];
  M.forEach(([n,f],i)=>{ const b=el('button',i?'':'active',n); b.onclick=()=>{ $$('button',modes).forEach(x=>x.classList.remove('active')); b.classList.add('active'); body.innerHTML=''; f(body); }; modes.appendChild(b); });
  d.appendChild(modes); d.appendChild(body); conv(body);
  function conv(b){
    const row=el('div','wrow'); const c1=el('div','wcol'), c2=el('div','wcol');
    const inp=el('input','numin'); inp.type='number'; inp.min=0; inp.max=999999999; inp.value=rnd(1,999); inp.placeholder='0 ~ 999,999,999';
    const out=el('div','bigout'); const fem=el('label',null,'<input type="checkbox"> 여성형 (una, doscientas…)'); fem.style.fontSize='13px';
    const upd=()=>{ const n=parseInt(inp.value||'0'); const w=numToEs(n,fem.firstChild.checked); out.innerHTML=''; out.appendChild(spk(w)); out.appendChild(el('span',null,w)); };
    inp.oninput=upd; fem.firstChild.onchange=upd; c1.appendChild(inp); c1.appendChild(fem); c2.appendChild(out);
    const quick=el('div','chips'); [0,7,15,16,21,29,31,100,101,115,200,500,999,1000,2026,15000,1000000].forEach(n=>{ const c=el('span','chip',String(n)); c.onclick=()=>{inp.value=n; upd(); speak(numToEs(n));}; quick.appendChild(c); });
    c1.appendChild(el('p','ko','자주 틀리는 숫자:')); c1.appendChild(quick);
    row.appendChild(c1); row.appendChild(c2); b.appendChild(row); upd();
  }
  function quizCore(b, mode){
    const ranges=[[0,30],[0,100],[100,1000],[1000,100000],[0,10000000]]; let lvl=1; let n; let streak=0; let score=0, total=0;
    const cnt=el('div','counter'); const q=el('div','bigout'); const inp=el('input','numin'); inp.placeholder='스페인어로 입력…'; inp.type='text';
    const fb=el('div','feedback'); const lv=el('div','modes'); ranges.forEach((r,i)=>{ const bt=el('button',i===lvl?'active':'',`Lv${i+1} (${r[0]}~${r[1].toLocaleString()})`); bt.onclick=()=>{lvl=i; $$('button',lv).forEach(x=>x.classList.remove('active')); bt.classList.add('active'); next();}; lv.appendChild(bt); });
    const btns=el('div','timectl'); const bChk=el('button','btn p','정답 확인'); const bRep=el('button','btn b','🔊 다시 듣기'); const bNext=el('button','btn s','다음 ▶'); btns.append(bChk,bRep,bNext);
    const next=()=>{ n=rnd(...ranges[lvl]); inp.value=''; fb.className='feedback'; q.innerHTML=''; if(mode==='listen'){ q.appendChild(el('span',null,'🎧 숫자를 듣고 스페인어로 쓰세요')); setTimeout(()=>speak(numToEs(n)),200); } else { q.appendChild(el('span',null,n.toLocaleString())); } inp.focus(); };
    const upd=()=>cnt.innerHTML=`<div class="c">정답 <b>${score}</b>/${total}</div><div class="c">🔥 연속 ${streak}</div>`;
    bChk.onclick=()=>{ const r=check(inp.value,[numToEs(n),numToEs(n,true)]); total++; if(r==='ok'){score++;streak++; fb.className='feedback show ok'; fb.textContent=`¡Correcto! ${n.toLocaleString()} = ${numToEs(n)}`; if(streak%5===0) confetti(40);} else if(r==='near'){ fb.className='feedback show near'; fb.textContent=`거의 맞았어요! 강세(악센트)를 확인하세요 → ${numToEs(n)}`; streak=0;} else { fb.className='feedback show ng'; fb.textContent=`정답: ${n.toLocaleString()} = ${numToEs(n)}`; streak=0; } upd(); speak(numToEs(n)); };
    bRep.onclick=()=>speak(numToEs(n)); bNext.onclick=next; inp.onkeydown=e=>{ if(e.key==='Enter'){ if(fb.classList.contains('show')) next(); else bChk.click(); } };
    b.append(lv,cnt,q,accentBar(),inp,btns,fb); upd(); next();
  }
  function listen(b){ quizCore(b,'listen'); }
  function write(b){ quizCore(b,'write'); }
  function ordinals(b){ const g=el('div','cards'); ORD.forEach(([w,n])=>{ const f=el('div','flip'); f.innerHTML=`<div class="in"><div class="f">${n}</div><div class="b">${w}</div></div>`; f.onclick=()=>{f.classList.toggle('on'); speak(w);}; g.appendChild(f); }); b.appendChild(el('p','ko','primero/tercero는 남성 단수명사 앞에서 primer/tercer: el primer día, el tercer piso')); b.appendChild(g); }
  return d;
};

/* 달력 */
WIDGETS.calendar=function(){
  const d=el('div','widget'); d.appendChild(el('h3',null,'📅 살아있는 달력 — 날짜를 클릭하면 스페인어로 말해줍니다'));
  const row=el('div','wrow'); const c1=el('div','wcol'), c2=el('div','wcol');
  const today=new Date(); let y=today.getFullYear(), m=today.getMonth(); let sel=new Date(today);
  const head=el('div','timectl'); const prev=el('button','btn s','◀'); const nxt=el('button','btn s','▶'); const title=el('div','dig'); title.style.minWidth='220px'; title.style.fontSize='18px';
  head.append(prev,title,nxt); const cal=el('div','cal'); const out=el('div','bigout'); const sub=el('div','ko');
  const render=()=>{ title.textContent=MONTHS[m]+' de '+y; cal.innerHTML=''; ['L','M','X','J','V','S','D'].forEach((x,i)=>cal.appendChild(el('div','dh',DAYS[i].slice(0,3)))); const first=(new Date(y,m,1).getDay()+6)%7; const days=new Date(y,m+1,0).getDate(); for(let i=0;i<first;i++) cal.appendChild(el('div','d empty','')); for(let dd=1;dd<=days;dd++){ const c=el('div','d',dd); const dt=new Date(y,m,dd); if(dt.toDateString()===today.toDateString()) c.classList.add('today'); if(dt.toDateString()===sel.toDateString()) c.classList.add('sel'); c.onclick=()=>{sel=dt; render(); say();}; cal.appendChild(c);} };
  const dateEs=(dt)=>{ const dow=DAYS[(dt.getDay()+6)%7]; const dnum=dt.getDate()===1?'primero':numToEs(dt.getDate()); return {short:`${dow}, ${dnum} de ${MONTHS[dt.getMonth()]} de ${numToEs(dt.getFullYear())}`, q:`Hoy es ${dow}. Es el ${dnum} de ${MONTHS[dt.getMonth()]} de ${numToEs(dt.getFullYear())}.`}; };
  const say=()=>{ const r=dateEs(sel); out.innerHTML=''; out.appendChild(spk(r.q)); out.appendChild(el('span',null,r.q)); sub.textContent=`${sel.getFullYear()}년 ${sel.getMonth()+1}월 ${sel.getDate()}일 ${['월','화','수','목','금','토','일'][(sel.getDay()+6)%7]}요일 — ¿Qué día es hoy? / ¿Qué fecha es hoy?`; speak(r.q); };
  prev.onclick=()=>{m--; if(m<0){m=11;y--;} render();}; nxt.onclick=()=>{m++; if(m>11){m=0;y++;} render();};
  c1.append(head,cal); c2.append(out,sub);
  // 날짜 받아쓰기
  const qz=el('div'); qz.appendChild(el('h4',null,'✍️ 날짜 받아쓰기 연습')); const qd=el('div','dig'); qd.style.fontSize='20px'; const inp=el('input','numin'); inp.type='text'; inp.placeholder='예: el cinco de mayo'; const fb=el('div','feedback'); let cur;
  const nq=()=>{ cur=new Date(2020+rnd(0,8),rnd(0,11),rnd(1,28)); qd.textContent=`${cur.getMonth()+1}월 ${cur.getDate()}일`; inp.value=''; fb.className='feedback'; };
  const bt=el('div','timectl'); const ck=el('button','btn p','확인'); const nx=el('button','btn s','다음 ▶'); bt.append(ck,nx);
  ck.onclick=()=>{ const dn=cur.getDate()===1?['primero','uno']:[numToEs(cur.getDate())]; const ans=[]; dn.forEach(x=>{ans.push(`el ${x} de ${MONTHS[cur.getMonth()]}`); ans.push(`${x} de ${MONTHS[cur.getMonth()]}`); ans.push(`es el ${x} de ${MONTHS[cur.getMonth()]}`);}); const r=check(inp.value,ans); fb.className='feedback show '+(r==='ok'?'ok':r==='near'?'near':'ng'); fb.textContent=(r==='ok'?'¡Muy bien! ':r==='near'?'강세를 확인하세요: ':'정답: ')+ans[0]; speak(ans[0]); };
  nx.onclick=nq; inp.onkeydown=e=>{if(e.key==='Enter'){ if(fb.classList.contains('show')) nq(); else ck.click(); }};
  qz.append(qd,accentBar(),inp,bt,fb); c2.appendChild(qz);
  row.append(c1,c2); d.appendChild(row); render(); setTimeout(()=>{ const r=dateEs(sel); out.innerHTML=''; out.appendChild(spk(r.q)); out.appendChild(el('span',null,r.q)); },0); nq();
  return d;
};

/* 시계 */
function makeClock(onChange){
  const NS='http://www.w3.org/2000/svg'; const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','-12 -12 324 324'); svg.setAttribute('class','clock');
  const mk=(t,a)=>{const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); svg.appendChild(e); return e;};
  mk('circle',{cx:150,cy:150,r:140,class:'face'});
  for(let i=0;i<60;i++){ const a=i*6*Math.PI/180; const big=i%5===0; const r1=big?118:126; mk('line',{x1:150+r1*Math.sin(a),y1:150-r1*Math.cos(a),x2:150+132*Math.sin(a),y2:150-132*Math.cos(a),class:'tick'+(big?' big':'')}); }
  for(let i=1;i<=12;i++){ const a=i*30*Math.PI/180; const t=mk('text',{x:150+100*Math.sin(a),y:150-100*Math.cos(a),class:'num'}); t.textContent=i; const ml=mk('text',{x:150+148*Math.sin(a),y:150-148*Math.cos(a),class:'minlab'}); ml.textContent=i*5===60?'00':i*5; }
  const hour=mk('line',{x1:150,y1:150,x2:150,y2:90,class:'hand hour'}); const minute=mk('line',{x1:150,y1:150,x2:150,y2:50,class:'hand minute'});
  const knobH=mk('circle',{cx:150,cy:90,r:22,class:'knob'}); const knobM=mk('circle',{cx:150,cy:50,r:22,class:'knob'}); mk('circle',{cx:150,cy:150,r:7,class:'center'});
  let h=3,m=0;
  function draw(){ const ma=m*6, ha=(h%12)*30+m*0.5; const set=(ln,ang,len,knob)=>{ const a=ang*Math.PI/180; const x=150+len*Math.sin(a), y=150-len*Math.cos(a); ln.setAttribute('x2',x); ln.setAttribute('y2',y); knob.setAttribute('cx',x); knob.setAttribute('cy',y); }; set(hour,ha,65,knobH); set(minute,ma,95,knobM); }
  function setTime(hh,mm){ h=((hh%12)+12)%12; m=((mm%60)+60)%60; draw(); }
  function get(){ return {h:h===0?12:h, m}; }
  let drag=null;
  const ang=(e)=>{ const r=svg.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; const x=(p.clientX-r.left)/r.width*324-162, y=(p.clientY-r.top)/r.height*324-162; let a=Math.atan2(x,-y)*180/Math.PI; if(a<0)a+=360; return a; };
  const start=(which)=>e=>{ drag=which; e.preventDefault(); };
  knobM.addEventListener('pointerdown',start('m')); knobH.addEventListener('pointerdown',start('h')); minute.addEventListener('pointerdown',start('m')); hour.addEventListener('pointerdown',start('h'));
  window.addEventListener('pointermove',e=>{ if(!drag) return; const a=ang(e); if(drag==='m'){ const nm=Math.round(a/6)%60; if(nm!==m){ if(m>50&&nm<10) h=(h+1)%12; else if(m<10&&nm>50) h=(h+11)%12; m=nm; } } else { h=Math.round(a/30)%12; } draw(); onChange&&onChange(get()); });
  window.addEventListener('pointerup',()=>drag=null);
  draw(); return {svg,setTime,get};
}
WIDGETS.clock=function(){
  const d=el('div','widget'); d.appendChild(el('h3',null,'🕒 시계 연습장 — 바늘을 직접 돌려보세요'));
  const modes=el('div','modes'); const body=el('div');
  const M=[['자유 탐색',explore],['시계 보고 말하기',readMode],['읽고 시계 맞추기',setMode],['듣고 시계 맞추기',listenMode]];
  M.forEach(([n,f],i)=>{ const b=el('button',i?'':'active',n); b.onclick=()=>{ $$('button',modes).forEach(x=>x.classList.remove('active')); b.classList.add('active'); body.innerHTML=''; f(body); }; modes.appendChild(b); });
  d.append(modes,body); explore(body);

  function controls(clock, after){
    const c=el('div','timectl'); const dig=el('div','dig');
    const st=(label,fn)=>{ const s=el('div','stepper'); const a=el('button',null,'−'), b=el('button',null,'+'); a.onclick=()=>{fn(-1); upd();}; b.onclick=()=>{fn(1); upd();}; s.append(a,el('span',null,label),b); return s; };
    let ampm=0; // 0: am 1: pm (표현용)
    const sh=st('시간',k=>{const t=clock.get(); clock.setTime(t.h+k,t.m);}); const sm=st('5분',k=>{const t=clock.get(); let mm=t.m+5*k, hh=t.h; if(mm>=60){mm-=60;hh++;} if(mm<0){mm+=60;hh--;} clock.setTime(hh,mm);});
    const tog=el('button','btn o','오전/오후'); tog.onclick=()=>{ampm=1-ampm; upd();};
    const upd=()=>{ const t=clock.get(); dig.textContent=String(t.h).padStart(2,'0')+':'+String(t.m).padStart(2,'0')+(ampm?' PM':' AM'); after&&after(t,ampm); };
    c.append(sh,dig,sm,tog); upd(); return {c,upd,get ampm(){return ampm;}};
  }
  function explore(b){
    const row=el('div','wrow'); const c1=el('div','wcol clockbox'), c2=el('div','wcol'); const out=el('div','bigout'); const sub=el('div','ko'); const clock=makeClock(()=>ctl.upd());
    const ctl=controls(clock,(t,pm)=>{ const h24=(t.h%12)+(pm?12:0); const r=timeToEs(h24,t.m); out.innerHTML=''; out.appendChild(spk(r.verb+' '+r.full)); out.appendChild(el('span',null,`${r.verb.charAt(0).toUpperCase()+r.verb.slice(1)} ${r.full}.`)); sub.innerHTML=`¿Qué hora es? → <b>${r.verb} ${r.text}</b>${t.m===45?' (= el cuarto para '+(timeToEs(h24,t.m).text.split(' menos')[0])+')':''} <br>• 1시만 단수 <b>es la una</b>, 나머지는 <b>son las…</b><br>• 30분까지는 <b>y</b>, 31분부터는 다음 시 <b>menos</b> (남미: <b>para</b>)`; });
    c1.appendChild(clock.svg); c2.append(out,sub,ctl.c); row.append(c1,c2); b.appendChild(row); clock.setTime(rnd(1,12),rnd(0,11)*5); ctl.upd();
  }
  function readMode(b){
    let cur, score=0,total=0,streak=0; const cnt=el('div','counter'); const row=el('div','wrow'); const c1=el('div','wcol clockbox'), c2=el('div','wcol'); const clock=makeClock(); const q=el('div','bigout','¿Qué hora es?'); const inp=el('input','numin'); inp.type='text'; inp.placeholder='예: son las tres y media'; const fb=el('div','feedback');
    const opts=el('div','opts'); const tg=el('div','modes'); let mode='type'; [['객관식','mc'],['주관식','type']].forEach(([n,v],i)=>{const bt=el('button',v===mode?'active':'',n); bt.onclick=()=>{mode=v; $$('button',tg).forEach(x=>x.classList.remove('active')); bt.classList.add('active'); next();}; tg.appendChild(bt);});
    const upd=()=>cnt.innerHTML=`<div class="c">정답 <b>${score}</b>/${total}</div><div class="c">🔥 연속 ${streak}</div>`;
    const next=()=>{ cur={h:rnd(1,12),m:rnd(0,11)*5}; clock.setTime(cur.h,cur.m); inp.value=''; fb.className='feedback'; opts.innerHTML=''; inp.style.display=mode==='type'?'':'none'; bchk.style.display=mode==='type'?'':'none';
      if(mode==='mc'){ const right=timeToEs(cur.h,cur.m); const set=new Set([right.text]); while(set.size<4){ const t=timeToEs(rnd(1,12),rnd(0,11)*5).text; set.add(t);} shuffle([...set]).forEach(o=>{ const ob=el('button','opt',(o.startsWith('la una')?'Es ':'Son ')+o); ob.onclick=()=>{ total++; if(o===right.text){score++;streak++;ob.classList.add('ok'); fb.className='feedback show ok'; fb.textContent='¡Correcto!'; if(streak%5===0)confetti(40);} else {streak=0; ob.classList.add('ng'); fb.className='feedback show ng'; fb.textContent='정답: '+(right.text.startsWith('la una')?'Es ':'Son ')+right.text;} $$('.opt',opts).forEach(x=>x.disabled=true); upd(); speak(right.verb+' '+right.text); }; opts.appendChild(ob); }); }
      inp.focus(); };
    const bchk=el('button','btn p','정답 확인'); const bn=el('button','btn s','다음 ▶'); const bl=el('button','btn b','🔊 정답 듣기');
    bchk.onclick=()=>{ const r=timeToEs(cur.h,cur.m); const res=check(inp.value,r.alts); total++; if(res==='ok'){score++;streak++; fb.className='feedback show ok'; fb.textContent=`¡Correcto! ${r.verb.charAt(0).toUpperCase()+r.verb.slice(1)} ${r.text}.`; if(streak%5===0)confetti(40);} else if(res==='near'){streak=0; fb.className='feedback show near'; fb.textContent=`거의! 강세를 확인하세요 → ${r.verb} ${r.text}`;} else {streak=0; fb.className='feedback show ng'; fb.textContent=`정답: ${r.verb} ${r.text}`;} upd(); speak(r.verb+' '+r.text); };
    bn.onclick=next; bl.onclick=()=>{const r=timeToEs(cur.h,cur.m); speak(r.verb+' '+r.text);}; inp.onkeydown=e=>{if(e.key==='Enter'){ if(fb.classList.contains('show')) next(); else bchk.click(); }};
    const bt=el('div','timectl'); bt.append(bchk,bl,bn); c1.appendChild(clock.svg); c2.append(tg,cnt,q,opts,accentBar(),inp,bt,fb); row.append(c1,c2); b.appendChild(row); upd(); next();
  }
  function setCore(b, listen){
    let cur, score=0,total=0,streak=0; const cnt=el('div','counter'); const row=el('div','wrow'); const c1=el('div','wcol clockbox'), c2=el('div','wcol'); const q=el('div','bigout'); const fb=el('div','feedback'); const clock=makeClock(()=>ctl.upd()); const ctl=controls(clock);
    const upd=()=>cnt.innerHTML=`<div class="c">정답 <b>${score}</b>/${total}</div><div class="c">🔥 연속 ${streak}</div>`;
    const say=()=>{const r=timeToEs(cur.h,cur.m); speak(r.verb+' '+r.text);};
    const next=()=>{ cur={h:rnd(1,12),m:rnd(0,11)*5}; const r=timeToEs(cur.h,cur.m); q.innerHTML=''; q.appendChild(spk(r.verb+' '+r.text)); q.appendChild(el('span',null,listen?'🎧 듣고 시계를 맞추세요':r.verb.charAt(0).toUpperCase()+r.verb.slice(1)+' '+r.text+'.')); fb.className='feedback'; clock.setTime(12,0); ctl.upd(); if(listen) setTimeout(say,300); };
    const bchk=el('button','btn p','시계 확인'); const bn=el('button','btn s','다음 ▶'); const bl=el('button','btn b','🔊 다시 듣기');
    bchk.onclick=()=>{ const t=clock.get(); total++; if(t.h===cur.h&&t.m===cur.m){score++;streak++; fb.className='feedback show ok'; fb.textContent='¡Perfecto! 정확합니다.'; if(streak%5===0)confetti(40);} else {streak=0; fb.className='feedback show ng'; fb.textContent=`아쉬워요. 정답은 ${cur.h}:${String(cur.m).padStart(2,'0')} 입니다.`; clock.setTime(cur.h,cur.m); ctl.upd();} upd(); };
    bn.onclick=next; bl.onclick=say; const bt=el('div','timectl'); bt.append(bchk,bl,bn);
    c1.appendChild(clock.svg); c2.append(cnt,q,el('p','ko','바늘을 드래그하거나 아래 버튼으로 시간을 맞춘 뒤 확인을 누르세요.'),ctl.c,bt,fb); row.append(c1,c2); b.appendChild(row); upd(); next();
  }
  function setMode(b){ setCore(b,false); }
  function listenMode(b){ setCore(b,true); }
  return d;
};

/* 동사 변화 트레이너 */
const PRON=['yo','tú','él / ella / usted','nosotros/as','vosotros/as','ellos / ellas / ustedes'];
const VERBS={
  presente:{label:'현재 (Presente)', items:{
    hablar:['hablo','hablas','habla','hablamos','habláis','hablan'], trabajar:['trabajo','trabajas','trabaja','trabajamos','trabajáis','trabajan'], estudiar:['estudio','estudias','estudia','estudiamos','estudiáis','estudian'], comer:['como','comes','come','comemos','coméis','comen'], beber:['bebo','bebes','bebe','bebemos','bebéis','beben'], aprender:['aprendo','aprendes','aprende','aprendemos','aprendéis','aprenden'], vivir:['vivo','vives','vive','vivimos','vivís','viven'], escribir:['escribo','escribes','escribe','escribimos','escribís','escriben'], abrir:['abro','abres','abre','abrimos','abrís','abren'],
    ser:['soy','eres','es','somos','sois','son'], estar:['estoy','estás','está','estamos','estáis','están'], tener:['tengo','tienes','tiene','tenemos','tenéis','tienen'], ir:['voy','vas','va','vamos','vais','van'], hacer:['hago','haces','hace','hacemos','hacéis','hacen'], querer:['quiero','quieres','quiere','queremos','queréis','quieren'], poder:['puedo','puedes','puede','podemos','podéis','pueden'], pedir:['pido','pides','pide','pedimos','pedís','piden'], jugar:['juego','juegas','juega','jugamos','jugáis','juegan'], salir:['salgo','sales','sale','salimos','salís','salen'], venir:['vengo','vienes','viene','venimos','venís','vienen'], decir:['digo','dices','dice','decimos','decís','dicen'], dormir:['duermo','duermes','duerme','dormimos','dormís','duermen'], conocer:['conozco','conoces','conoce','conocemos','conocéis','conocen'], saber:['sé','sabes','sabe','sabemos','sabéis','saben'], poner:['pongo','pones','pone','ponemos','ponéis','ponen'], empezar:['empiezo','empiezas','empieza','empezamos','empezáis','empiezan'], volver:['vuelvo','vuelves','vuelve','volvemos','volvéis','vuelven'], }},
  indefinido:{label:'직설법 과거 (Indefinido)', items:{
    hablar:['hablé','hablaste','habló','hablamos','hablasteis','hablaron'], trabajar:['trabajé','trabajaste','trabajó','trabajamos','trabajasteis','trabajaron'], comer:['comí','comiste','comió','comimos','comisteis','comieron'], vivir:['viví','viviste','vivió','vivimos','vivisteis','vivieron'], escribir:['escribí','escribiste','escribió','escribimos','escribisteis','escribieron'],
    ser:['fui','fuiste','fue','fuimos','fuisteis','fueron'], ir:['fui','fuiste','fue','fuimos','fuisteis','fueron'], estar:['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'], tener:['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'], hacer:['hice','hiciste','hizo','hicimos','hicisteis','hicieron'], poder:['pude','pudiste','pudo','pudimos','pudisteis','pudieron'], poner:['puse','pusiste','puso','pusimos','pusisteis','pusieron'], querer:['quise','quisiste','quiso','quisimos','quisisteis','quisieron'], venir:['vine','viniste','vino','vinimos','vinisteis','vinieron'], decir:['dije','dijiste','dijo','dijimos','dijisteis','dijeron'], dar:['di','diste','dio','dimos','disteis','dieron'], ver:['vi','viste','vio','vimos','visteis','vieron'], leer:['leí','leíste','leyó','leímos','leísteis','leyeron'], dormir:['dormí','dormiste','durmió','dormimos','dormisteis','durmieron'], pedir:['pedí','pediste','pidió','pedimos','pedisteis','pidieron'], }},
  imperfecto:{label:'불완료 과거 (Imperfecto)', items:{
    hablar:['hablaba','hablabas','hablaba','hablábamos','hablabais','hablaban'], trabajar:['trabajaba','trabajabas','trabajaba','trabajábamos','trabajabais','trabajaban'], comer:['comía','comías','comía','comíamos','comíais','comían'], vivir:['vivía','vivías','vivía','vivíamos','vivíais','vivían'], tener:['tenía','tenías','tenía','teníamos','teníais','tenían'], hacer:['hacía','hacías','hacía','hacíamos','hacíais','hacían'], ser:['era','eras','era','éramos','erais','eran'], ir:['iba','ibas','iba','íbamos','ibais','iban'], ver:['veía','veías','veía','veíamos','veíais','veían'], estar:['estaba','estabas','estaba','estábamos','estabais','estaban'], }},
  perfecto:{label:'현재완료 (Pretérito perfecto)', items:{
    hablar:['he hablado','has hablado','ha hablado','hemos hablado','habéis hablado','han hablado'], comer:['he comido','has comido','ha comido','hemos comido','habéis comido','han comido'], vivir:['he vivido','has vivido','ha vivido','hemos vivido','habéis vivido','han vivido'], hacer:['he hecho','has hecho','ha hecho','hemos hecho','habéis hecho','han hecho'], ver:['he visto','has visto','ha visto','hemos visto','habéis visto','han visto'], escribir:['he escrito','has escrito','ha escrito','hemos escrito','habéis escrito','han escrito'], decir:['he dicho','has dicho','ha dicho','hemos dicho','habéis dicho','han dicho'], poner:['he puesto','has puesto','ha puesto','hemos puesto','habéis puesto','han puesto'], volver:['he vuelto','has vuelto','ha vuelto','hemos vuelto','habéis vuelto','han vuelto'], abrir:['he abierto','has abierto','ha abierto','hemos abierto','habéis abierto','han abierto'], romper:['he roto','has roto','ha roto','hemos roto','habéis roto','han roto'], }},
  futuro:{label:'미래 (Futuro)', items:{
    hablar:['hablaré','hablarás','hablará','hablaremos','hablaréis','hablarán'], comer:['comeré','comerás','comerá','comeremos','comeréis','comerán'], vivir:['viviré','vivirás','vivirá','viviremos','viviréis','vivirán'], tener:['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'], hacer:['haré','harás','hará','haremos','haréis','harán'], poder:['podré','podrás','podrá','podremos','podréis','podrán'], salir:['saldré','saldrás','saldrá','saldremos','saldréis','saldrán'], venir:['vendré','vendrás','vendrá','vendremos','vendréis','vendrán'], decir:['diré','dirás','dirá','diremos','diréis','dirán'], poner:['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'], saber:['sabré','sabrás','sabrá','sabremos','sabréis','sabrán'], querer:['querré','querrás','querrá','querremos','querréis','querrán'], haber:['habré','habrás','habrá','habremos','habréis','habrán'], }},
  imperativo:{label:'긍정 명령 (tú / usted / vosotros / ustedes)', pron:['tú','usted','vosotros/as','ustedes'], items:{
    hablar:['habla','hable','hablad','hablen'], comer:['come','coma','comed','coman'], vivir:['vive','viva','vivid','vivan'], abrir:['abre','abra','abrid','abran'], cerrar:['cierra','cierre','cerrad','cierren'], pedir:['pide','pida','pedid','pidan'], dormir:['duerme','duerma','dormid','duerman'], jugar:['juega','juegue','jugad','jueguen'], tener:['ten','tenga','tened','tengan'], hacer:['haz','haga','haced','hagan'], poner:['pon','ponga','poned','pongan'], salir:['sal','salga','salid','salgan'], venir:['ven','venga','venid','vengan'], decir:['di','diga','decid','digan'], ir:['ve','vaya','id','vayan'], ser:['sé','sea','sed','sean'], }},
  imperativo_neg:{label:'부정 명령 (no + …)', pron:['tú','usted','vosotros/as','ustedes'], items:{
    hablar:['no hables','no hable','no habléis','no hablen'], comer:['no comas','no coma','no comáis','no coman'], vivir:['no vivas','no viva','no viváis','no vivan'], cerrar:['no cierres','no cierre','no cerréis','no cierren'], pedir:['no pidas','no pida','no pidáis','no pidan'], tener:['no tengas','no tenga','no tengáis','no tengan'], hacer:['no hagas','no haga','no hagáis','no hagan'], poner:['no pongas','no ponga','no pongáis','no pongan'], salir:['no salgas','no salga','no salgáis','no salgan'], ir:['no vayas','no vaya','no vayáis','no vayan'], ser:['no seas','no sea','no seáis','no sean'], decir:['no digas','no diga','no digáis','no digan'], }},
};
WIDGETS.verbtrainer=function(s){
  const d=el('div','widget'); d.appendChild(el('h3',null,s.title||'🏋️ 동사변화 연습장 — 무한 반복 드릴'));
  const tenses=s.tenses||Object.keys(VERBS); const row=el('div','timectl'); row.style.justifyContent='flex-start';
  const selT=el('select','numin'); selT.style.height='44px'; selT.style.fontSize='15px'; selT.style.width='auto'; tenses.forEach(t=>{const o=el('option',null,VERBS[t].label); o.value=t; selT.appendChild(o);});
  const selV=el('select','numin'); selV.style.height='44px'; selV.style.fontSize='15px'; selV.style.width='auto';
  const bRand=el('button','btn b','🎲 랜덤 동사'); const bChk=el('button','btn p','채점'); const bShow=el('button','btn s','정답 보기'); const bClr=el('button','btn o','지우기');
  row.append(selT,selV,bRand,bChk,bShow,bClr); const box=el('div','conj'); const fb=el('div','feedback'); const cnt=el('div','counter'); let good=0,tries=0;
  const fillV=()=>{ selV.innerHTML=''; Object.keys(VERBS[selT.value].items).forEach(v=>{const o=el('option',null,v); selV.appendChild(o);}); };
  const build=()=>{ box.innerHTML=''; fb.className='feedback'; const t=VERBS[selT.value]; const v=selV.value; const forms=t.items[v]; const pr=t.pron||PRON; const cb=el('div','conjbox'); cb.innerHTML=`<h4>${v} <small style="font-weight:600;opacity:.7">— ${t.label}</small></h4>`; forms.forEach((f,i)=>{ const r=el('div','row'); r.innerHTML=`<span class="pr">${pr[i]}</span>`; const inp=el('input'); inp.type='text'; inp.autocomplete='off'; inp.dataset.a=f; r.appendChild(inp); const a=el('span','a'); r.appendChild(a); const sp=spk(f,true); r.appendChild(sp); cb.appendChild(r); inp.onkeydown=e=>{ if(e.key==='Enter'){ const nx=inp.closest('.row').nextElementSibling; if(nx) nx.querySelector('input').focus(); else bChk.click(); } }; }); box.appendChild(cb); };
  bChk.onclick=()=>{ let ok=0; const rows=$$('.row',box); rows.forEach(r=>{ const inp=r.querySelector('input'); const res=check(inp.value,[inp.dataset.a]); r.classList.remove('ok','ng'); r.classList.add(res==='ok'?'ok':'ng'); r.querySelector('.a').textContent=res==='ok'?'✓':res==='near'?'강세! → '+inp.dataset.a:'→ '+inp.dataset.a; if(res==='ok') ok++; }); tries++; if(ok===rows.length){good++; confetti(50); fb.className='feedback show ok'; fb.textContent='¡Excelente! 전부 정답입니다.'; } else { fb.className='feedback show ng'; fb.textContent=`${ok}/${rows.length} 정답. 틀린 칸을 확인하세요.`; } cnt.innerHTML=`<div class="c">완벽 통과 <b>${good}</b>/${tries}</div>`; };
  bShow.onclick=()=>$$('.row',box).forEach(r=>{const inp=r.querySelector('input'); inp.value=inp.dataset.a; r.classList.add('ok');});
  bClr.onclick=build; bRand.onclick=()=>{ const ks=Object.keys(VERBS[selT.value].items); selV.value=pick(ks); build(); };
  selT.onchange=()=>{fillV(); build();}; selV.onchange=build; fillV(); if(s.verb && [...selV.options].some(o=>o.value===s.verb)) selV.value=s.verb; build();
  d.append(row,accentBar(),cnt,box,fb); return d;
};

/* ---------- 연습문제 렌더러 ---------- */
let CUR=null; // 현재 챕터
const EXR={};
function exrShell(idx, ex){
  const d=el('div','exr'+(ex._retry?' retry':'')); d.dataset.idx=idx; if(ex._retry) d.dataset.retry='1';
  d.innerHTML=`<div class="head"><div class="n">${idx+1}</div><div><h3>${ex.title}${ex._retry?' <span class="rtag">✗ 틀린 문제 다시 풀기</span>':''}</h3>${ex.instr?`<p>${esify(ex.instr)}</p>`:''}</div></div>`;
  if(!ex._retry && chProgress(CUR.id).done.includes(idx)) d.classList.add('done');
  return d;
}
/* 연습 모드: instant(바로 확인) | exam(시험 모드) */
let EXMODE=localStorage.getItem('dbsg_exmode')||'instant';
let FORCE_INSTANT=0;
const isExam=()=>EXMODE==='exam' && !FORCE_INSTANT;
/* ---------- 오답노트 저장소 ---------- */
const WKEY='dbsg_wrong';
function loadW(){ try{return JSON.parse(localStorage.getItem(WKEY))||{};}catch(e){return {};} }
function saveW(w){ try{localStorage.setItem(WKEY,JSON.stringify(w));}catch(e){} }
function wrongOf(cid){ const w=loadW(); return w[cid]||{items:{},solved:0}; }
const OI=(ex,i)=> ex&&ex._oi ? ex._oi[i] : i;
function wrongRec(exi, ii, ok, user, answered, noOk, ctx){
  if(!CUR||exi==null||ii==null) return; const w=loadW(); const c=w[CUR.id]||(w[CUR.id]={items:{},solved:0}); const k=exi+':'+ii;
  if(ctx){ ctx._miss=ctx._miss||new Set(); if(!ok && (answered||isExam())) ctx._miss.add(k); if(ok && ctx._miss.has(k)) return; } // 한 번 틀린 문제는 같은 화면에서 고쳐 맞혀도 노트에 남김
  if(ok){ if(noOk) return; if(c.items[k]){ delete c.items[k]; c.solved=(c.solved||0)+1; saveW(w); updWrongBadge(); } return; }
  if(!answered && !isExam()) return;
  const e=c.items[k]||{n:0,first:Date.now()}; const u=(user||'').trim();
  if(e.n && e.u===u && Date.now()-(e.ts||0)<10*60*1000) return; // 같은 답을 연달아 확인한 경우 중복 집계 방지
  e.n++; e.ts=Date.now(); e.u=u; c.items[k]=e; saveW(w); updWrongBadge();
}
function wrongCount(cid){ return Object.keys(wrongOf(cid).items).length; }
function updWrongBadge(){ const b=document.querySelector('.tabs .wcnt'); if(b&&CUR){ const n=wrongCount(CUR.id); b.textContent=n; b.style.display=n?'':'none'; } }
function foot(d, onCheck, onReset, onShow){
  const f=el('div','foot'); const bC=el('button','btn p','✔ 정답 확인'); const bR=el('button','btn s','↺ 다시'); const bS=el('button','btn o','정답 보기'); const sc=el('span','score');
  const doCheck=(quiet)=>{ const r=onCheck(); sc.textContent=`${r[0]} / ${r[1]}`; sc.className='score'+(r[0]===r[1]?' good':''); if(r[0]===r[1]){ d.classList.add('done'); if(!d.dataset.retry) setDone(CUR.id,+d.dataset.idx,CUR.exercises.length); if(!quiet){ confetti(60); toast(d.dataset.retry?'🎉 틀렸던 문제를 모두 해결했습니다!':'🎉 ¡Perfecto! 문제를 모두 맞혔습니다'); } } updRetryBtn(); return r; };
  const bW=el('button','btn w',''); bW.style.display='none';
  const updRetryBtn=()=>{ if(d.dataset.retry||isExam()){ bW.style.display='none'; return; } const n=Object.keys(wrongOf(CUR.id).items).filter(k=>k.split(':')[0]===d.dataset.idx).length; bW.textContent=`✗ 틀린 문제만 다시 풀기 (${n})`; bW.style.display=n?'':'none'; };
  bW.onclick=()=>{ const view=retryView(CUR, [+d.dataset.idx], ()=>{ view.replaceWith(d); updRetryBtn(); }); d.replaceWith(view); view.scrollIntoView({behavior:'smooth',block:'start'}); };
  bC.onclick=()=>doCheck(false);
  bR.onclick=()=>{ onReset(); sc.textContent=''; };
  d._api={check:()=>doCheck(true), reset:()=>{onReset(); sc.textContent='';}, show:onShow||null, revealButtons:()=>{ bS.style.display=''; bC.style.display=''; }};
  f.append(bC,bR); if(onShow){ bS.onclick=onShow; f.appendChild(bS);} f.append(bW,sc); d.appendChild(f); setTimeout(updRetryBtn,0);
  if(isExam()){ bC.style.display='none'; bS.style.display='none'; }
}
function markItem(it, res, ans, inputEl){
  it.classList.remove('ok','ng','near'); it.classList.add(res==='ok'?'ok':res==='near'?'near':'ng');
  let a=it.querySelector('.ans'); if(!a){a=el('div','ans'); it.appendChild(a);}
  a.className='ans'+(res==='ok'?'':' bad'); a.textContent=res==='ok'?'✓ ¡Correcto!':res==='near'?'△ 거의 맞았어요 — 강세(악센트)를 확인하세요: '+ans:'✗ 정답: '+ans;
}
/* 선택지가 정해진 빈칸 → 드롭다운 (key = 장:연습문제 번호, by=1이면 정답이 목록에 있는 빈칸만) */
const CHOICES={"06:0": {"o": ["un", "una", "unos", "unas"]}, "06:1": {"o": ["el", "la", "los", "las"]}, "08:1": {"o": ["soy", "eres", "es", "somos", "sois", "son"]}, "08:2": {"o": ["de", "soy", "eres", "es", "somos", "sois", "son", "soy de", "eres de", "es de", "somos de", "sois de", "son de"]}, "08:3": {"o": ["estoy", "estás", "está", "estamos", "estáis", "están"]}, "11:0": {"o": ["quién", "quiénes", "qué"]}, "11:2": {"o": ["dónde", "adónde", "cuándo"]}, "12:0": {"o": ["más", "menos", "mejor", "peor", "mayor", "menor"], "by": 1}, "12:1": {"o": ["tan", "tanto", "tanta", "tantos", "tantas", "como"]}, "16:4": {"o": ["ya", "todavía"], "by": 1}, "22:1": {"o": ["tengo que", "tienes que", "tiene que", "tenemos que", "tenéis que", "tienen que", "no tengo que", "no tienes que", "no tiene que", "no tenemos que", "no tenéis que", "no tienen que"]}, "22:2": {"o": ["hay que", "había que"]}, "23:0": {"o": ["aquí", "ahí", "allí"]}, "23:2": {"o": ["hoy", "ayer", "anteayer", "mañana", "pasado mañana", "anoche"]}, "23:4": {"o": ["ya", "todavía no"]}, "23:8": {"o": ["bastante", "demasiado", "muy", "un poco", "nada", "poco", "mucho"]}, "23:11": {"o": ["más", "menos", "tan", "tanto", "que", "como", "mejor", "peor"]}, "24:0": {"o": ["y", "e", "ni"]}, "24:1": {"o": ["o", "u", "y", "e"]}, "24:2": {"o": ["pero", "sino"]}, "24:3": {"o": ["y", "e", "ni", "o", "pero"]}, "25:1": {"o": ["a", "de", "desde", "hasta", "dentro de"]}, "25:2": {"o": ["a", "de", "desde", "hasta", "dentro de", "durante"]}, "25:3": {"o": ["antes de", "durante", "después de"]}, "26:1": {"o": ["a", "hacia", "hasta", "de", "desde"]}, "26:2": {"o": ["de", "a", "sobre", "en", "entre"]}, "27:0": {"o": ["encima de", "debajo de", "dentro de", "fuera de", "delante de", "detrás de", "enfrente del", "al lado de", "alrededor de", "cerca de", "lejos del", "a la derecha del"]}, "27:1": {"o": ["encima de", "debajo de", "debajo del", "dentro de", "dentro del", "fuera de", "cerca de", "lejos de"]}, "27:2": {"o": ["delante de", "detrás de", "enfrente de", "enfrente del", "al lado de", "entre", "alrededor de", "alrededor del"]}, "28:0": {"o": ["a", "al", "X"]}, "28:1": {"o": ["a", "de", "en", "sobre"]}, "28:2": {"o": ["a", "de", "en", "sobre"]}, "29:2": {"o": ["por", "para", "sin", "con", "contra"]}, "29:3": {"o": ["por", "para", "sin", "con", "contra"]}};
function blankChoices(cid, idx, ans){ const c=CHOICES[cid+':'+idx]; if(!c) return null; const first=String(ans).split('|')[0]; const low=first.toLowerCase(); const alts=String(ans).split('|').map(x=>x.toLowerCase());
  if(c.by && !c.o.some(o=>alts.includes(o.toLowerCase()))) return null;
  let opts=c.o.slice(); if(!opts.some(o=>o.toLowerCase()===low)) opts.push(low);
  const cap=first[0]!==first[0].toLowerCase() && first!=='X';
  return opts.map(o=> o==='X'?'X': cap? o[0].toUpperCase()+o.slice(1) : o); }
function makeSelect(opts){ const s=el('select','blank sel'); s.innerHTML='<option value="">선택</option>'+opts.map(o=>`<option value="${o}">${o==='X'?'X (필요 없음)':o}</option>`).join(''); return s; }
EXR.fill=function(idx, ex){
  const d=exrShell(idx,ex); d.appendChild(accentBar()); const box=el('div','items');
  ex.items.forEach((it,i)=>{ const r=el('div','item'); r.appendChild(el('span','idx',i+1+'.')); const parts=it.q.split('___'); parts.forEach((p,k)=>{ r.appendChild(el('span',null,esify(p))); if(k<parts.length-1){ const aK=(Array.isArray(it.a)?(it.a[k]??it.a[0]):it.a); const ch=blankChoices(CUR.id, idx, aK); let inp; if(ch){ inp=makeSelect(ch); inp.dataset.k=k; r.appendChild(inp); inp.onchange=()=>{ const rowInps=$$('.blank',r); if(!isExam() && rowInps.every(x=>x.value.trim())) checkRow(r,i); }; return; } inp=el('input','blank'); inp.type='text'; inp.autocomplete='off'; inp.spellcheck=false; inp.dataset.k=k; if(it.hint&&k===0) inp.placeholder=it.hint; r.appendChild(inp); inp.onkeydown=e=>{ if(e.key==='Enter'){ const rowInps=$$('.blank',r); if(!isExam() && rowInps.every(x=>x.value.trim())){ checkRow(r,i); } const all=$$('.blank',box); const n=all[all.indexOf(inp)+1]; if(n) n.focus(); } }; } }); if(it.ko) r.appendChild(el('div','ko',it.ko)); const sp=spk(it.say||it.q.replace(/___/g, (Array.isArray(it.a)?it.a[0]:it.a).toString().split('|')[0]),true); r.appendChild(sp); box.appendChild(r); });
  d.appendChild(box); bindSpk(d);
  if($$('select.blank',box).length && !$$('input.blank',box).length){ d.querySelector('.accentbar, .accents')?.remove(); const p=d.querySelector('.head p'); if(p) p.innerHTML=p.innerHTML.replace(/쓰세요/g,'고르세요').replace(/넣으세요/g,'고르세요'); else d.querySelector('.head h3').insertAdjacentHTML('afterend','<p>드롭다운에서 알맞은 것을 고르세요.</p>'); }
  const answers=(it)=> (Array.isArray(it.a)?it.a:[it.a]); // per blank: array of strings; string may have alternatives separated by |
  function checkRow(r,i){ const it=ex.items[i]; const ans=answers(it); const inps=$$('.blank',r); let allOk=true, near=false; inps.forEach((inp,k)=>{ const accepted=String(ans[k]??ans[0]).split('|'); const res=check(inp.value,accepted); inp.classList.remove('ok','ng'); inp.classList.add(res==='ok'?'ok':'ng'); if(res!=='ok') allOk=false; if(res==='near') near=true; }); const show=ans.map(a=>String(a).split('|')[0]).join(' / '); markItem(r, allOk?'ok':near?'near':'ng', show); wrongRec(idx, OI(ex,i), allOk, inps.map(x=>x.value).join(' / '), inps.some(x=>x.value.trim()), 0, d); if(allOk&&!isExam()) speak(it.say||it.q.replace(/___/g,()=>String(ans[0]).split('|')[0]).replace(/<.*?>/g,'')); return allOk; }
  foot(d, ()=>{ let ok=0; $$('.item',box).forEach((r,i)=>{ if(checkRow(r,i)) ok++; }); return [ok, ex.items.length]; },
   ()=>{ $$('.item',box).forEach(r=>{ r.classList.remove('ok','ng','near'); $$('.blank',r).forEach(i=>{i.value=''; i.classList.remove('ok','ng');}); const a=r.querySelector('.ans'); a&&a.remove(); }); },
   ()=>{ $$('.item',box).forEach((r,i)=>{ const ans=answers(ex.items[i]); $$('.blank',r).forEach((inp,k)=>{ const alts=String(ans[k]??ans[0]).split('|'); if(inp.tagName==='SELECT'){ const v=[...inp.options].map(o=>o.value).find(v=>v&&alts.some(a=>a.toLowerCase()===v.toLowerCase())); inp.value=v||''; } else inp.value=alts[0]; }); }); });
  return d;
};
EXR.mc=function(idx, ex){
  const d=exrShell(idx,ex); const box=el('div','items'); const sel={};
  ex.items.forEach((it,i)=>{ const r=el('div','item'); r.style.flexDirection='column'; r.style.alignItems='flex-start'; const q=el('div',null,`<span class="idx">${i+1}.</span> ${esify(it.q)}`); r.appendChild(q); if(it.ko) r.appendChild(el('div','ko',it.ko)); const o=el('div','opts'); it.opts.forEach((op,k)=>{ const b=el('button','opt',esify(op)); b.onclick=()=>{ if(r.classList.contains('ok')&&!isExam()) return; $$('.opt',o).forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel[i]=k; if(!isExam()) checkRow(r,i); }; o.appendChild(b); }); r.appendChild(o); box.appendChild(r); });
  d.appendChild(box); bindSpk(d);
  function checkRow(r,i){ const it=ex.items[i]; const opts=$$('.opt',r); opts.forEach((b,k)=>{ b.classList.remove('ok','ng'); if(k===it.a) b.classList.add('ok'); else if(sel[i]===k) b.classList.add('ng'); }); const good=sel[i]===it.a; wrongRec(idx, OI(ex,i), good, sel[i]!=null?String(it.opts[sel[i]]).replace(/\[\[|\]\]/g,''):'', sel[i]!=null, 0, d); markItem(r, good?'ok':'ng', it.opts[it.a].replace(/\[\[|\]\]/g,'')+(it.exp?' — '+it.exp:'')); if(good&&it.exp) r.querySelector('.ans').textContent='✓ ¡Correcto! — '+it.exp; return good; }
  foot(d, ()=>{ let ok=0; $$('.item',box).forEach((r,i)=>{ if(checkRow(r,i)) ok++; }); return [ok, ex.items.length]; },
   ()=>{ for(const k in sel) delete sel[k]; $$('.item',box).forEach(r=>{ r.classList.remove('ok','ng'); $$('.opt',r).forEach(b=>b.classList.remove('ok','ng','sel')); const a=r.querySelector('.ans'); a&&a.remove(); }); });
  return d;
};
EXR.classify=function(idx, ex){
  const d=exrShell(idx,ex); d.appendChild(el('p','ko','단어를 드래그하거나, 단어를 클릭한 뒤 상자를 클릭하세요.'));
  const pool=el('div','pool'); const bk=el('div','buckets'); let selected=null;
  const items=shuffle(ex.items.map((it,i)=>({...it,i})));
  const place=(chip,bin)=>{ bin.appendChild(chip); chip.classList.remove('sel'); selected=null; };
  items.forEach(it=>{ const c=el('div','drag',it.t); c.draggable=true; c.dataset.oi=OI(ex,it.i); c.dataset.b=it.b; c.dataset.t=it.t; c.ondragstart=e=>{ e.dataTransfer.setData('text',it.t); selected=c; }; c.onclick=e=>{ e.stopPropagation(); $$('.drag',d).forEach(x=>x.classList.remove('sel')); if(selected===c){selected=null;} else {selected=c; c.classList.add('sel');} speak(it.t); }; pool.appendChild(c); });
  ex.buckets.forEach((b,i)=>{ const x=el('div','bucket'); x.dataset.i=i; x.innerHTML=`<h4>${b}</h4>`; const bin=el('div','bin'); x.appendChild(bin); x.ondragover=e=>{e.preventDefault(); x.classList.add('over');}; x.ondragleave=()=>x.classList.remove('over'); x.ondrop=e=>{e.preventDefault(); x.classList.remove('over'); if(selected) place(selected,bin);}; x.onclick=()=>{ if(selected) place(selected,bin); }; bk.appendChild(x); });
  pool.ondragover=e=>e.preventDefault(); pool.ondrop=e=>{ if(selected) place(selected,pool); }; pool.onclick=()=>{ if(selected) place(selected,pool); };
  d.append(pool,bk);
  foot(d, ()=>{ let ok=0; $$('.bucket',bk).forEach(x=>{ $$('.drag',x).forEach(c=>{ c.classList.remove('ok','ng'); const good=+c.dataset.b===+x.dataset.i; c.classList.add(good?'ok':'ng'); if(good) ok++; wrongRec(idx, +c.dataset.oi, good, ex.buckets[+x.dataset.i], true, 0, d); }); }); $$('.drag',pool).forEach(c=>{ c.classList.add('ng'); wrongRec(idx, +c.dataset.oi, false, '', false, 0, d); }); return [ok, ex.items.length]; },
   ()=>{ $$('.drag',d).forEach(c=>{ c.classList.remove('ok','ng','sel'); pool.appendChild(c); }); },
   ()=>{ $$('.drag',d).forEach(c=>{ const bin=$$('.bucket',bk)[+c.dataset.b].querySelector('.bin'); bin.appendChild(c); c.classList.remove('ng'); c.classList.add('ok'); }); });
  return d;
};
EXR.match=function(idx, ex){
  const d=exrShell(idx,ex); d.appendChild(el('p','ko','왼쪽과 오른쪽에서 짝이 되는 항목을 차례로 클릭하세요.'));
  const g=el('div','match'); const L=el('div','mcol'), R=el('div','mcol'); let a=null, b=null; let got=0;
  const left=ex.pairs.map((p,i)=>({t:p[0],i})); const right=shuffle(ex.pairs.map((p,i)=>({t:p[1],i})));
  const pairs=new Map();
  const tryMatch=()=>{ if(!a||!b) return; if(isExam()){ a.classList.add('paired'); b.classList.add('paired'); a.classList.remove('sel'); b.classList.remove('sel'); const n=pairs.size+1; pairs.forEach((v,k)=>{ if(v===b){ k.classList.remove('paired'); k.querySelector('.pn')?.remove(); pairs.delete(k);} }); if(pairs.has(a)){ const old=pairs.get(a); old.classList.remove('paired'); old.querySelector('.pn')?.remove(); } pairs.set(a,b); [a,b].forEach(x=>{ x.querySelector('.pn')?.remove(); x.insertAdjacentHTML('beforeend',`<span class="pn">${[...pairs.keys()].indexOf(a)+1}</span>`); }); a=null;b=null; return; } if(+a.dataset.i===+b.dataset.i){ if(!missed.has(+a.dataset.i)) wrongRec(idx, OI(ex,+a.dataset.i), true); a.classList.add('ok'); b.classList.add('ok'); got++; speak(a.dataset.es||a.textContent); if(got===ex.pairs.length){ d.classList.add('done'); if(!ex._retry) setDone(CUR.id,idx,CUR.exercises.length); confetti(60); toast('🎉 모두 연결했습니다!'); } } else { missed.add(+a.dataset.i); wrongRec(idx, OI(ex,+a.dataset.i), false, b.textContent, true); a.classList.add('ng'); b.classList.add('ng'); const x=a,y=b; setTimeout(()=>{x.classList.remove('ng','sel'); y.classList.remove('ng','sel');},600); } a=null;b=null; };
  const missed=new Set();
  left.forEach(it=>{ const m=el('button','mi',it.t); m.dataset.i=it.i; m.dataset.es=it.t; m.onclick=()=>{ $$('.mi',L).forEach(x=>x.classList.remove('sel')); m.classList.add('sel'); a=m; tryMatch(); }; L.appendChild(m); });
  right.forEach(it=>{ const m=el('button','mi',it.t); m.dataset.i=it.i; m.onclick=()=>{ $$('.mi',R).forEach(x=>x.classList.remove('sel')); m.classList.add('sel'); b=m; tryMatch(); }; R.appendChild(m); });
  g.append(L,R); d.appendChild(g);
  const f=el('div','foot'); const bR=el('button','btn s','↺ 다시 섞기'); const sc=el('span','score'); bR.onclick=()=>{ got=0; a=b=null; const nd=EXR.match(idx,ex); d.replaceWith(nd); }; f.append(bR,sc); d.appendChild(f);
  if(isExam()) d.appendChild(el('p','ko','시험 모드: 짝을 지어 두면 번호가 붙고, 제출할 때 채점됩니다.'));
  d._api={check:()=>{ let ok=0; pairs.forEach((bb,aa)=>{ const good=+aa.dataset.i===+bb.dataset.i; aa.classList.add(good?'ok':'ng'); bb.classList.add(good?'ok':'ng'); if(good) ok++; wrongRec(idx, OI(ex,+aa.dataset.i), good, bb.textContent.replace(/\d+$/,''), true); }); $$('.mi',L).forEach(m=>{ if(!pairs.has(m)) wrongRec(idx, OI(ex,+m.dataset.i), false, '', false); }); $$('.mi',g).forEach(m=>{ if(!m.classList.contains('ok')&&!m.classList.contains('ng')) m.classList.add('ng'); }); sc.textContent=`${ok} / ${ex.pairs.length}`; if(ok===ex.pairs.length){ d.classList.add('done'); if(!ex._retry) setDone(CUR.id,idx,CUR.exercises.length); } return [ok, ex.pairs.length]; }, reset:()=>bR.click(), show:()=>{ $$('.mi',L).forEach(m=>{ const r=$$('.mi',R).find(x=>x.dataset.i===m.dataset.i); m.classList.remove('ng'); r.classList.remove('ng'); m.classList.add('ok'); r.classList.add('ok'); m.querySelector('.pn')?.remove(); r.querySelector('.pn')?.remove(); const n=+m.dataset.i+1; m.insertAdjacentHTML('beforeend',`<span class="pn">${n}</span>`); r.insertAdjacentHTML('beforeend',`<span class="pn">${n}</span>`); }); }, revealButtons:()=>{}};
  return d;
};
EXR.order=function(idx, ex){
  const d=exrShell(idx,ex); d.appendChild(el('p','ko','단어를 순서대로 클릭하여 문장을 완성하세요. 완성 칸의 단어를 클릭하면 되돌아갑니다.')); const box=el('div','items');
  ex.items.forEach((it,i)=>{ const r=el('div','item order'); r.style.flexDirection='column'; r.style.alignItems='flex-start'; r.innerHTML=`<div><span class="idx">${i+1}.</span> ${it.ko?'<span class="ko">'+it.ko+'</span>':''}</div>`; const slot=el('div','slot'); const bank=el('div','bank'); shuffle(it.words).forEach(w=>{ const b=el('button','word',w); b.onclick=()=>{ if(b.parentElement===bank) slot.appendChild(b); else bank.appendChild(b); }; bank.appendChild(b); }); r.append(slot,bank); box.appendChild(r); });
  d.appendChild(box);
  foot(d, ()=>{ let ok=0; $$('.item',box).forEach((r,i)=>{ const s=$$('.word',r.querySelector('.slot')).map(w=>w.textContent).join(' '); const ans=Array.isArray(ex.items[i].a)?ex.items[i].a:[ex.items[i].a]; const res=check(s,ans); markItem(r,res,ans[0]); wrongRec(idx, OI(ex,i), res==='ok', s, !!s.trim(), 0, d); if(res==='ok'){ok++; speak(ans[0]);} }); return [ok, ex.items.length]; },
   ()=>{ $$('.item',box).forEach(r=>{ r.classList.remove('ok','ng','near'); const bank=r.querySelector('.bank'); $$('.word',r.querySelector('.slot')).forEach(w=>bank.appendChild(w)); const a=r.querySelector('.ans'); a&&a.remove(); }); },
   ()=>{ $$('.item',box).forEach((r,i)=>{ const ans=(Array.isArray(ex.items[i].a)?ex.items[i].a[0]:ex.items[i].a); const slot=r.querySelector('.slot'); const ws=$$('.word',r); let rest=ans; let guard=0; while(rest.length&&guard++<50){ const cands=ws.filter(x=>x.parentElement!==slot&&rest.startsWith(x.textContent)).sort((a,b)=>b.textContent.length-a.textContent.length); if(!cands.length) break; slot.appendChild(cands[0]); rest=rest.slice(cands[0].textContent.length).trimStart(); } }); });
  return d;
};
EXR.conj=function(idx, ex){
  const d=exrShell(idx,ex); d.appendChild(accentBar()); const g=el('div','conj');
  ex.items.forEach((it,vi)=>{ const pr=it.pron||PRON; const cb=el('div','conjbox'); cb.dataset.vi=vi; cb.innerHTML=`<h4>${it.verb}${it.note?` <small style="font-weight:600;opacity:.7">${it.note}</small>`:''}</h4>`; it.forms.forEach((f,i)=>{ const r=el('div','row'); r.innerHTML=`<span class="pr">${pr[i]}</span>`; const inp=el('input'); inp.type='text'; inp.autocomplete='off'; inp.dataset.a=f; r.appendChild(inp); r.appendChild(el('span','a')); r.appendChild(spk(f.split('|')[0],true)); cb.appendChild(r); inp.onkeydown=e=>{ if(e.key==='Enter'){ const all=$$('input',g); const n=all[all.indexOf(inp)+1]; n&&n.focus(); } }; }); g.appendChild(cb); });
  d.appendChild(g);
  const total=ex.items.reduce((s,it)=>s+it.forms.length,0);
  foot(d, ()=>{ let ok=0; $$('.row',g).forEach(r=>{ const inp=r.querySelector('input'); const res=check(inp.value,inp.dataset.a.split('|')); r.classList.remove('ok','ng'); r.classList.add(res==='ok'?'ok':'ng'); r.querySelector('.a').textContent=res==='ok'?'✓':(res==='near'?'강세! → ':'→ ')+inp.dataset.a.split('|')[0]; if(res==='ok') ok++; }); $$('.conjbox',g).forEach(cb=>{ const rows=$$('.row',cb); const allOk=rows.every(r=>r.classList.contains('ok')); wrongRec(idx, OI(ex,+cb.dataset.vi), allOk, rows.map(r=>r.querySelector('input').value.trim()||'—').join(', '), rows.some(r=>r.querySelector('input').value.trim()), 0, d); }); return [ok,total]; },
   ()=>{ $$('.row',g).forEach(r=>{ r.classList.remove('ok','ng'); r.querySelector('input').value=''; r.querySelector('.a').textContent=''; }); },
   ()=>{ $$('.row',g).forEach(r=>{ r.querySelector('input').value=r.dataset.a||r.querySelector('input').dataset.a.split('|')[0]; }); });
  return d;
};
EXR.tf=function(idx, ex){ // 참/거짓 or 선택 2지
  return EXR.mc(idx,{...ex,items:ex.items.map(it=>({q:it.q,opts:ex.opts||['○ 맞다','✗ 틀리다'],a:it.a,exp:it.exp,ko:it.ko}))});
};
function renderExercise(idx, ex){ const f=EXR[ex.type]||EXR.fill; return f(idx,ex); }

/* ---------- 연습문제 패널 (모드 선택 + 시험 제출) ---------- */
function renderExercisePanel(panel, CH){
  panel.innerHTML='';
  if(!CH.exercises.length){ panel.appendChild(el('div','sec','이 장은 학습 탭의 인터랙티브 위젯으로 연습합니다.')); return; }
  const bar=el('div','modebar');
  bar.innerHTML=`<div class="modes"><button data-m="instant" class="${EXMODE==='instant'?'active':''}">⚡ 바로 확인</button><button data-m="exam" class="${EXMODE==='exam'?'active':''}">📝 시험 모드</button></div><div class="modedesc">${EXMODE==='instant'?'문제마다 바로 정답을 확인하며 공부합니다. 객관식은 클릭 즉시, 빈칸은 Enter로 채점됩니다.':'정답을 숨기고 모든 문제를 푼 뒤 한 번에 제출·채점합니다. 시간이 기록됩니다.'}</div>`;
  $$('button',bar).forEach(b=>b.onclick=()=>{ if(b.dataset.m===EXMODE) return; EXMODE=b.dataset.m; localStorage.setItem('dbsg_exmode',EXMODE); renderExercisePanel(panel,CH); toast(EXMODE==='exam'?'📝 시험 모드로 전환했습니다':'⚡ 바로 확인 모드로 전환했습니다'); });
  panel.appendChild(bar);
  const list=el('div'); CH.exercises.forEach((ex,i)=>list.appendChild(renderExercise(i,ex))); bindSpk(list);
  if(isExam()){
    const t0=Date.now(); let timer; const ebar=el('div','exambar'); ebar.innerHTML=`<span class="timer">⏱ 00:00</span><span class="ko">${CH.exercises.length}개 연습문제 · 모두 푼 뒤 제출하세요</span>`;
    const tm=ebar.querySelector('.timer'); timer=setInterval(()=>{ const s=Math.floor((Date.now()-t0)/1000); tm.textContent='⏱ '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); },500);
    const sub=el('button','btn p','✅ 시험 제출'); const res=el('div');
    sub.onclick=()=>{ if(!confirm('제출할까요? 제출 후에는 정답이 표시됩니다.')) return; clearInterval(timer); let ok=0,tot=0; const rows=[]; $$('.exr',list).forEach((d,i)=>{ const r=d._api.check(); ok+=r[0]; tot+=r[1]; rows.push({t:CH.exercises[i].title,r}); d._api.revealButtons&&d._api.revealButtons(); }); const p=Math.round(ok/tot*100); setBest(CH.id,p); const s=Math.floor((Date.now()-t0)/1000);
      res.innerHTML=`<div class="sec result"><div class="ring" style="--p:${p}"><b>${p}%</b></div><div class="big">${p===100?'🏆':p>=70?'🎉':'💪'}</div><h3 style="justify-content:center">${p===100?'¡Perfecto! 만점입니다':p>=70?'¡Muy bien! 합격입니다':'¡Ánimo! 틀린 문제를 복습하세요'}</h3><p>${ok} / ${tot} 정답 · 소요 시간 ${Math.floor(s/60)}분 ${s%60}초</p><table class="tbl" style="text-align:left"><tbody>${rows.map((x,i)=>`<tr><td class="s">${i+1}. ${x.t}</td><td style="text-align:right;font-weight:800;color:${x.r[0]===x.r[1]?'var(--green)':'var(--red)'}">${x.r[0]} / ${x.r[1]}</td></tr>`).join('')}</tbody></table></div>`;
      const again=el('button','btn p','↺ 다시 시험 보기'); again.onclick=()=>renderExercisePanel(panel,CH); res.querySelector('.result').appendChild(again); const nW=wrongCount(CH.id); if(nW){ const wb=el('button','btn w',`✗ 틀린 문제 다시 풀기 (${nW})`); wb.style.marginLeft='8px'; wb.onclick=()=>openWrongTab(true); res.querySelector('.result').appendChild(wb); } sub.disabled=true; sub.textContent='제출 완료'; if(p>=70) confetti(120); res.scrollIntoView({behavior:'smooth'}); };
    ebar.appendChild(sub); panel.appendChild(ebar); panel.appendChild(list); panel.appendChild(res);
    const sub2=el('button','btn p','✅ 시험 제출'); sub2.style.margin='0 0 20px'; sub2.onclick=()=>sub.click(); list.appendChild(sub2);
  } else panel.appendChild(list);
}

/* ---------- 틀린 문제 다시 풀기 · 오답노트 ---------- */
function retryEx(CH, exi){
  const ex=CH.exercises[exi]; const keys=Object.keys(wrongOf(CH.id).items).filter(k=>+k.split(':')[0]===exi).map(k=>+k.split(':')[1]).sort((a,b)=>a-b);
  if(!keys.length) return null; const base={...ex,_retry:true,_oi:keys};
  if(ex.type==='match') return {...base,pairs:keys.map(i=>ex.pairs[i]).filter(Boolean)};
  return {...base,items:keys.map(i=>ex.items[i]).filter(Boolean)};
}
function retryView(CH, exList, onBack){
  const prev=FORCE_INSTANT; FORCE_INSTANT=1;
  const v=el('div','retryview');
  const top=el('div','retrytop'); const back=el('button','btn s','← 돌아가기'); back.onclick=()=>{ FORCE_INSTANT=prev; onBack&&onBack(); };
  top.append(el('div',null,'<b>✗ 틀린 문제 다시 풀기</b><span class="ko"> 맞히면 오답노트에서 자동으로 빠집니다.</span>'),back); v.appendChild(top);
  let n=0; exList.forEach(exi=>{ const rx=retryEx(CH,exi); if(rx){ v.appendChild(renderExercise(exi,rx)); n++; } });
  if(!n) v.appendChild(el('div','sec','🎉 다시 풀 틀린 문제가 없습니다!'));
  bindSpk(v); return v;
}
function wrongEntryHtml(ex, ii){
  const A=x=>String(x).split('|')[0];
  if(ex.type==='match'){ const p=ex.pairs[ii]; return p?`<div class="wq">${esify(p[0])} ↔ <b class="wa">${esify(p[1])}</b></div>`:''; }
  const it=(ex.items||[])[ii]; if(!it) return '';
  if(ex.type==='fill'){ const ans=Array.isArray(it.a)?it.a:[it.a]; let k=0; const q=it.q.split('___').map((p,j,arr)=>esify(p)+(j<arr.length-1?`<b class="wa">${esify(A(ans[k++]??ans[0]))}</b>`:'')).join(''); return `<div class="wq">${q}</div>${it.ko?`<div class="ko">${it.ko}</div>`:''}`; }
  if(ex.type==='mc'||ex.type==='tf'){ const opts=it.opts||ex.opts||['○ 맞다','✗ 틀리다']; return `<div class="wq">${esify(it.q)}</div>${it.ko?`<div class="ko">${it.ko}</div>`:''}<div class="wans">정답: <b class="wa">${esify(opts[it.a])}</b>${it.exp?` — ${it.exp}`:''}</div>`; }
  if(ex.type==='order'){ const a=Array.isArray(it.a)?it.a[0]:it.a; return `${it.ko?`<div class="ko">${it.ko}</div>`:''}<div class="wans">정답: <b class="wa">${esify(a)}</b></div>`; }
  if(ex.type==='conj'){ const pr=it.pron||PRON; return `<div class="wq"><b>${it.verb}</b></div><div class="wans">${it.forms.map((f,i)=>`${pr[i]} <b class="wa">${A(f)}</b>`).join(' · ')}</div>`; }
  if(ex.type==='classify') return `<div class="wq"><b>${esify(it.t)}</b> → <b class="wa">${ex.buckets[it.b]}</b></div>`;
  return '';
}
function renderWrongPanel(panel, CH){
  panel.innerHTML=''; FORCE_INSTANT=1;
  const W=wrongOf(CH.id); const keys=Object.keys(W.items); const n=keys.length;
  const head=el('div','sec wronghead');
  head.innerHTML=`<div class="wstat"><div><b>${n}</b><span>남은 오답</span></div><div><b>${W.solved||0}</b><span>해결한 문제</span></div><div><b>${keys.reduce((s,k)=>s+(W.items[k].n||1),0)}</b><span>누적 틀린 횟수</span></div></div><p class="ko">연습문제·시험·종합 퀴즈에서 틀린 문제가 자동으로 모입니다. 다시 풀어서 맞히면 노트에서 빠집니다. (이 기기의 브라우저에 저장)</p>`;
  const btns=el('div','wbtns'); head.appendChild(btns); panel.appendChild(head);
  if(!n){ panel.appendChild(el('div','sec wempty','<div style="font-size:46px">🎉</div><h3 style="justify-content:center">오답이 없습니다</h3><p class="ko">연습문제를 풀면 틀린 문제가 이곳에 정리됩니다.</p>')); return; }
  const area=el('div');
  const bAll=el('button','btn p',`🔁 오답 전체 다시 풀기 (${n})`); const bPr=el('button','btn s','🖨 오답노트 인쇄'); const bClr=el('button','btn o','🗑 모두 지우기');
  btns.append(bAll,bPr,bClr);
  const exIdx=[...new Set(keys.map(k=>+k.split(':')[0]))].sort((a,b)=>a-b);
  bAll.onclick=()=>{ area.innerHTML=''; area.appendChild(retryView(CH, exIdx, ()=>renderWrongPanel(panel,CH))); area.scrollIntoView({behavior:'smooth'}); list.style.display='none'; btns.style.display='none'; };
  bPr.onclick=()=>{ document.body.classList.add('print-wrong'); setTimeout(()=>{ window.print(); document.body.classList.remove('print-wrong'); },50); };
  bClr.onclick=()=>{ if(!confirm('이 장의 오답노트를 모두 지울까요?')) return; const w=loadW(); delete w[CH.id]; saveW(w); updWrongBadge(); renderWrongPanel(panel,CH); };
  const list=el('div','wlist');
  exIdx.forEach(exi=>{ const ex=CH.exercises[exi]; if(!ex) return; const g=el('div','sec wgroup'); const ks=keys.filter(k=>+k.split(':')[0]===exi).sort((a,b)=>+a.split(':')[1]-+b.split(':')[1]);
    g.innerHTML=`<div class="wgh"><span class="n">${exi+1}</span><h3>${ex.title}</h3><span class="wc">${ks.length}문제</span></div>`;
    const one=el('button','btn w sm','✗ 이 연습문제만 다시 풀기'); one.onclick=()=>{ area.innerHTML=''; area.appendChild(retryView(CH,[exi],()=>renderWrongPanel(panel,CH))); list.style.display='none'; btns.style.display='none'; area.scrollIntoView({behavior:'smooth'}); }; g.querySelector('.wgh').appendChild(one);
    ks.forEach(k=>{ const ii=+k.split(':')[1]; const e=W.items[k]; const card=el('div','wcard'); const dt=new Date(e.ts||e.first||Date.now());
      card.innerHTML=`<div class="wbody">${wrongEntryHtml(ex,ii)}${e.u?`<div class="wmine">내 답: <s>${esify(e.u)}</s></div>`:'<div class="wmine">내 답: (미응답)</div>'}</div><div class="wmeta"><span class="wn">✗ ${e.n||1}회</span><span>${dt.getMonth()+1}/${dt.getDate()}</span></div>`;
      const del=el('button','wdel','✕'); del.title='노트에서 삭제'; del.onclick=()=>{ const w=loadW(); if(w[CH.id]){ delete w[CH.id].items[k]; saveW(w);} updWrongBadge(); renderWrongPanel(panel,CH); }; card.appendChild(del); g.appendChild(card); });
    list.appendChild(g); });
  panel.append(list, area); bindSpk(panel);
}
let openWrongTab=()=>{};

/* ---------- 종합 퀴즈 ---------- */
function buildQuizPool(CH){
  const pool=[];
  (CH.exercises||[]).forEach((ex,ei)=>{ const n0=pool.length;
    if(ex.type==='fill') ex.items.forEach(it=>{ const ans=(Array.isArray(it.a)?it.a:[it.a]); if(it.q.split('___').length!==2) return; const ch=blankChoices(CH.id, CH.exercises.indexOf(ex), ans[0]); if(ch){ const alts=String(ans[0]).split('|').map(x=>x.toLowerCase()); const opts=ch; pool.push({type:'mc',q:it.q.replace('___','＿＿＿'),ko:it.ko,opts:opts.map(o=>o==='X'?'X (필요 없음)':o),a:opts.findIndex(o=>alts.includes(o.toLowerCase()))}); } else pool.push({type:'type',q:it.q.replace('___','＿＿＿'),ko:it.ko,a:String(ans[0]).split('|'),hint:it.hint}); });
    if(ex.type==='mc') ex.items.forEach(it=>pool.push({type:'mc',q:it.q,ko:it.ko,opts:it.opts,a:it.a,exp:it.exp}));
    if(ex.type==='tf') ex.items.forEach(it=>pool.push({type:'mc',q:it.q,ko:it.ko,opts:ex.opts||['○ 맞다','✗ 틀리다'],a:it.a,exp:it.exp}));
    if(ex.type==='conj') ex.items.forEach(it=>{ const pr=it.pron||PRON; it.forms.forEach((f,i)=>pool.push({type:'type',q:`<b>${it.verb}</b> → ${pr[i]} ＿＿＿`,a:f.split('|')})); });
    if(ex.type==='classify') ex.items.forEach(it=>pool.push({type:'mc',q:`<b>${it.t}</b> 는 어디에 속할까요?`,opts:ex.buckets,a:it.b}));
    // 오답노트 연결용 참조 (연습문제 번호, 문항 번호)
    if(ex.type==='conj'){ let j=n0; ex.items.forEach((it,vi)=>it.forms.forEach(()=>{ if(pool[j]){ pool[j].ref=[ei,vi]; pool[j].noOk=1; } j++; })); }
    else if(ex.type==='fill'){ let j=n0; ex.items.forEach((it,ii)=>{ if(it.q.split('___').length===2){ pool[j].ref=[ei,ii]; j++; } }); }
    else for(let j=n0;j<pool.length;j++) pool[j].ref=[ei,j-n0];
  });
  (CH.quizExtra||[]).forEach(q=>pool.push(q));
  return pool;
}
function renderQuiz(container, CH){
  container.innerHTML=''; const pool=buildQuizPool(CH); if(pool.length<4){ container.appendChild(el('div','sec','이 장에는 종합 퀴즈용 문항이 충분하지 않습니다. 위젯과 연습문제로 학습하세요.')); return; }
  const N=Math.min(10,pool.length); const qs=shuffle(pool).slice(0,N); let i=0, score=0, t0=Date.now(); let timer;
  const box=el('div','sec quizbox'); container.appendChild(box);
  const intro=()=>{ box.innerHTML=`<div style="font-size:50px">🏆</div><h3 style="justify-content:center">종합 퀴즈 — ${N}문제</h3><p class="ko">이 장의 연습문제에서 무작위로 출제됩니다. 시간도 측정돼요!</p>`; const best=chProgress(CH.id).best; if(best) box.appendChild(el('p',null,`최고 점수: <b>${best}%</b>`)); const b=el('button','btn p','시작하기 ▶'); b.style.fontSize='16px'; b.onclick=()=>{ i=0;score=0;t0=Date.now(); step(); }; box.appendChild(b); };
  const step=()=>{ if(i>=N) return finish(); const q=qs[i]; box.innerHTML=''; const top=el('div',null,`<div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px;color:var(--muted)"><span>문제 ${i+1} / ${N}</span><span class="timer">00:00</span></div>`); const prog=el('div','prog','<i></i>'); prog.firstChild.style.width=(i/N*100)+'%'; box.append(top,prog); const tm=top.querySelector('.timer'); clearInterval(timer); timer=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000); tm.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');},500);
    box.appendChild(el('div','q',esify(q.q))); if(q.ko) box.appendChild(el('p','ko',q.ko)); const fb=el('div','feedback'); const nextB=el('button','btn p','다음 ▶'); nextB.style.display='none'; nextB.onclick=()=>{i++; step();};
    if(q.type==='mc'){ const o=el('div','opts'); q.opts.forEach((op,k)=>{ const b=el('button','opt',esify(op)); b.onclick=()=>{ $$('.opt',o).forEach(x=>x.disabled=true); if(q.ref) wrongRec(q.ref[0],q.ref[1],k===q.a,String(op).replace(/\[\[|\]\]/g,''),true,q.noOk); if(k===q.a){score++; b.classList.add('ok'); fb.className='feedback show ok'; fb.textContent='¡Correcto!';} else { b.classList.add('ng'); $$('.opt',o)[q.a].classList.add('ok'); fb.className='feedback show ng'; fb.textContent='정답: '+q.opts[q.a].replace(/\[\[|\]\]/g,'')+(q.exp?' — '+q.exp:''); } nextB.style.display=''; }; o.appendChild(b); }); box.appendChild(o); }
    else { const inp=el('input','blank'); inp.type='text'; inp.placeholder=q.hint||'답을 입력하세요'; inp.autocomplete='off'; const ck=el('button','btn p','확인'); const go=()=>{ if(ck.disabled) return; ck.disabled=true; inp.disabled=true; const r=check(inp.value,q.a); if(q.ref) wrongRec(q.ref[0],q.ref[1],r==='ok',inp.value,!!inp.value.trim(),q.noOk); if(r==='ok'){score++; fb.className='feedback show ok'; fb.textContent='¡Correcto! '+q.a[0];} else if(r==='near'){ fb.className='feedback show near'; fb.textContent='거의! 강세를 확인하세요 → '+q.a[0]; } else { fb.className='feedback show ng'; fb.textContent='정답: '+q.a[0]; } speak(q.a[0]); nextB.style.display=''; }; ck.onclick=go; inp.onkeydown=e=>{ if(e.key==='Enter'){ if(ck.disabled) nextB.click(); else go(); } }; box.appendChild(inp); box.appendChild(el('div')); box.appendChild(accentBar()); box.appendChild(ck); setTimeout(()=>inp.focus(),50); }
    box.append(fb,el('div'),nextB); bindSpk(box); };
  const finish=()=>{ clearInterval(timer); const p=Math.round(score/N*100); setBest(CH.id,p); const s=Math.floor((Date.now()-t0)/1000); box.innerHTML=`<div class="result"><div class="ring" style="--p:${p}"><b>${p}%</b></div><div class="big">${p===100?'🏆':p>=70?'🎉':'💪'}</div><h3 style="justify-content:center">${p===100?'¡Perfecto! 완벽합니다':p>=70?'¡Muy bien! 잘했어요':'¡Ánimo! 다시 도전해 보세요'}</h3><p>${score} / ${N} 정답 · 소요 시간 ${Math.floor(s/60)}분 ${s%60}초</p></div>`; const b=el('button','btn p','다시 도전 ▶'); b.onclick=()=>{ const nq=shuffle(pool).slice(0,N); qs.splice(0,N,...nq); i=0;score=0;t0=Date.now(); step(); }; box.appendChild(b); if(p>=70) confetti(120); };
  intro();
}

/* ---------- 챕터 페이지 렌더 ---------- */
function updateHeaderProgress(){ const e=$('#hdrProg'); if(e&&CUR){ e.textContent=pct(CUR.id,CUR.exercises.length)+'%'; } }
function renderChapter(CH){
  CUR=CH; const meta=CHAPTERS.find(c=>c.id===CH.id)||{}; const idx=CHAPTERS.indexOf(meta);
  document.title=`${idx>0?idx+'장. ':''}${meta.title} — 다인에듀 기초 스페인어 문법`;
  const root=$('#app'); root.innerHTML='';
  const hero=el('section','chap-hero'); hero.innerHTML=`<div class="crumb">${window.STANDALONE?'🎓 샘플 수업':'<a href="index.html">🏠 홈</a>'} › ${PARTS[meta.part].name}</div><h1>${meta.icon} ${idx>0?idx+'장. ':'서론. '}${meta.title}</h1><div class="sub">${meta.sub}</div>${CH.intro?`<div class="intro">${esify(CH.intro)}</div>`:''}`;
  root.appendChild(hero);
  const tabs=el('div','tabs'); const names=[['📖 학습',`<span class="cnt">${CH.sections.length}</span>`],['✍️ 연습문제',`<span class="cnt">${CH.exercises.length}</span>`],['🏆 종합 퀴즈',''],['📒 오답노트','<span class="cnt wcnt"></span>']];
  const panels=names.map(()=>el('div','panel'));
  names.forEach(([n,c],i)=>{ const b=el('button',i?'':'active',n+c); b.onclick=()=>{ $$('button',tabs).forEach(x=>x.classList.remove('active')); panels.forEach(p=>p.classList.remove('active')); b.classList.add('active'); panels[i].classList.add('active'); FORCE_INSTANT=(i===3)?1:0; if(i===2) renderQuiz(panels[2],CH); if(i===3){ renderWrongPanel(panels[3],CH); } window.scrollTo({top:hero.offsetHeight,behavior:'smooth'}); }; tabs.appendChild(b); });
  panels[0].classList.add('active'); root.appendChild(tabs); panels.forEach(p=>root.appendChild(p));
  CH.sections.forEach(s=>panels[0].appendChild(renderSection(s)));
  renderExercisePanel(panels[1], CH);
  openWrongTab=()=>{ $$('button',tabs)[3].click(); };
  updWrongBadge();
  const nav=el('div','chapnav'); const prev=CHAPTERS[idx-1], next=CHAPTERS[idx+1];
  nav.innerHTML=(prev?`<a href="${window.FULL_SITE||''}ch${prev.id}.html"><small>◀ 이전</small><b>${prev.icon} ${prev.title}</b></a>`:'<span></span>')+(next?`<a class="next" href="${window.FULL_SITE||''}ch${next.id}.html"><small>다음 ▶</small><b>${next.icon} ${next.title}</b></a>`:'<a class="next" href="index.html"><small>처음으로</small><b>🏠 전체 목차</b></a>');
  if(!window.STANDALONE) root.appendChild(nav); else { const cta=el('div','enroll'); cta.innerHTML=`<p>이 수업이 마음에 드셨나요? 서론부터 30장까지 전체 과정을 후안샘과 함께 공부해 보세요.</p><a class="enrollbtn" href="https://www.dainedu.net/%EC%88%98%EA%B0%95%EC%8B%A0%EC%B2%AD" target="_top">📝 수강신청하러 가기 ▶</a>`; root.appendChild(cta); }
  const p=loadP(); const c=p[CH.id]||{done:[],best:0,visits:0}; c.visits=(c.visits||0)+1; c.total=CH.exercises.length; p[CH.id]=c; saveP(p); updateHeaderProgress();
  // 학습 탭 자동 완료 체크(연습문제 없는 장)
  if(!CH.exercises.length){ const pp=loadP(); pp[CH.id].done=[0]; pp[CH.id].total=1; saveP(pp); }
}

/* ---------- 허브 ---------- */
function renderHub(){
  const root=$('#hub'); root.innerHTML='';
  const p=loadP(); const totalEx=CHAPTERS.length; let doneCh=0, started=0; CHAPTERS.forEach(c=>{ const x=p[c.id]; if(x&&x.visits) started++; if(x&&x.total&&x.done.length>=x.total) doneCh++; });
  $('#statDone').textContent=doneCh; $('#statStart').textContent=started; $('#statTotal').textContent=totalEx;
  PARTS.forEach((pt,pi)=>{ const sec=el('section','part'); sec.innerHTML=`<h2>${pt.name} <span class="tag">${pt.tag}</span></h2><p class="desc">${pt.desc}</p>`; const g=el('div','grid'); CHAPTERS.filter(c=>c.part===pi).forEach(c=>{ const i=CHAPTERS.indexOf(c); const x=p[c.id]; const pc=x&&x.total?Math.min(100,Math.round(x.done.length/x.total*100)):0; const a=el('a','chcard'+(pc===100?' done':'')); a.href=`ch${c.id}.html`; a.dataset.search=(c.title+' '+c.sub).toLowerCase(); a.innerHTML=`<div class="num">${i===0?'INTRO':'CAPÍTULO '+i}</div><div class="ic">${c.icon}</div><h3>${c.title}</h3><div class="sub">${c.sub}</div><div class="bar"><i style="width:${pc}%"></i></div>${x&&x.visits?`<div class="pct">${pc===100?'✓ 완료':pc+'%'}</div>`:''}${wrongCount(c.id)?`<div class="wbadge">📒 오답 ${wrongCount(c.id)}</div>`:''}`; g.appendChild(a); }); sec.appendChild(g); root.appendChild(sec); });
  const s=$('#q'); if(s) s.oninput=()=>{ const v=s.value.toLowerCase().trim(); $$('.chcard').forEach(c=>c.style.display=!v||c.dataset.search.includes(v)?'':'none'); $$('.part').forEach(pt=>{ pt.style.display=$$('.chcard',pt).some(c=>c.style.display!=='none')?'':'none'; }); };
}

/* ---------- 후안샘 봇 (내장 챗봇) ---------- */
const TENSE_WORDS={presente:['현재','presente','지금'],indefinido:['직설법 과거','단순과거','indefinido','pretérito','과거'],imperfecto:['불완료','imperfecto'],perfecto:['현재완료','perfecto','완료'],futuro:['미래','futuro'],imperativo:['명령','imperativo'],imperativo_neg:['부정 명령','부정명령']};
function stripHtml(h){ const t=document.createElement('div'); t.innerHTML=h; return t.textContent||''; }
function kbScore(q, entry){ const nq=strip(q.toLowerCase()); const toks=nq.split(/[^a-z0-9가-힣ñ]+/); let s=0; entry.k.forEach(k=>{ const nk=strip(k.toLowerCase()); if(nk.length<2) return; if(nk.length<=2){ if(toks.includes(nk)) s+=2; } else if(nq.includes(nk)) s+=nk.length>=4?3:2; }); if(strip(entry.t.toLowerCase()).split(/\s+/).some(w=>w.length>1&&nq.includes(w))) s+=1; return s; }
function chapterLink(id){ const c=CHAPTERS.find(x=>x.id===id); if(!c) return ''; const i=CHAPTERS.indexOf(c); return ` <a href="${window.FULL_SITE||''}ch${id}.html">→ ${i>0?i+'장':'서론'} ${c.title} 보기</a>`; }
function answerLocal(q){
  const raw=q.trim(); const nq=strip(raw.toLowerCase());
  // 숫자
  const nm=raw.replace(/[.,\s]/g,'').match(/^(\d{1,9})$/)||(/(숫자|número|numero|스페인어로)/.test(nq)&&raw.match(/(\d[\d.,]*)/));
  if(nm){ const n=parseInt(String(nm[1]).replace(/[.,]/g,'')); if(!isNaN(n)&&n<1e9){ const w=numToEs(n); return {html:`<b>${n.toLocaleString()}</b> = <span class="es">${w}</span><button class="spk sm" data-say="${w}">🔊</button>${n%100===1||Math.floor(n/100)%10?'<br><small>여성 명사 앞: '+numToEs(n,true)+'</small>':''}${chapterLink('02')}`}; } }
  // 시간
  const tm=raw.match(/(\d{1,2})\s*[:시h]\s*(\d{1,2})?\s*(분)?/);
  if(tm&&(/시|:|hora|h\b/.test(raw))){ const h=+tm[1], m=+(tm[2]||0); if(h>=0&&h<=24&&m<60){ const pm=/오후|pm|tarde|noche|저녁|밤/i.test(raw); const am=/오전|am|mañana|아침|새벽/i.test(raw)||h>12; const h24=pm&&h<12?h+12:h; const r=timeToEs(h24,m); const v=r.verb.charAt(0).toUpperCase()+r.verb.slice(1); const full=(pm||am)?r.full:r.text; return {html:`🕒 <b>${h}:${String(m).padStart(2,'0')}</b> → <span class="es">${v} ${full}.</span><button class="spk sm" data-say="${r.verb} ${full}">🔊</button>${(pm||am)?'':'<br><small>오전/오후를 붙이면: de la mañana / de la tarde / de la noche</small>'}${r.alts.length>2?'<br><small>다른 표현: '+r.alts.filter(a=>!a.startsWith('es ')&&!a.startsWith('son ')&&a!==r.text).slice(0,3).join(' / ')+'</small>':''}${chapterLink('03')}`}; } }
  // 동사 변화
  const words=nq.replace(/[¿?¡!.,]/g,' ').split(/\s+/);
  let verb=null; for(const w of words){ for(const t in VERBS){ if(VERBS[t].items[w]){ verb=w; break; } } if(verb) break; }
  if(!verb){ const m2=nq.match(/([a-zñ]+(ar|er|ir))\b/); if(m2){ for(const t in VERBS){ if(VERBS[t].items[m2[1]]){ verb=m2[1]; break; } } } }
  const kbBest=window.KB?Math.max(0,...KB.map(e=>kbScore(raw,e))):0; const grammarQ=/차이|vs|용법|언제|구별|비교|쓰나|쓰는|규칙|뜻/.test(nq)||(nq.match(/\b(ser|estar|saber|conocer|por|para|ir|haber)\b/g)||[]).length>=2;
  if(verb&&grammarQ&&kbBest>=3) verb=null;
  if(verb){ let tenses=Object.keys(VERBS).filter(t=>VERBS[t].items[verb]); const asked=Object.keys(TENSE_WORDS).filter(t=>TENSE_WORDS[t].some(w=>nq.includes(strip(w)))); let sel=asked.filter(t=>tenses.includes(t)); if(sel.includes('imperativo_neg')&&!/부정/.test(nq)) sel=sel.filter(t=>t!=='imperativo_neg'); if(sel.includes('indefinido')&&sel.includes('imperfecto')&&!/불완료/.test(nq)) sel=sel.filter(t=>t!=='imperfecto'); if(!sel.length) sel=tenses.slice(0,3); const tables=sel.map(t=>{ const pr=VERBS[t].pron||PRON; return `<b>${VERBS[t].label}</b><table>${VERBS[t].items[verb].map((f,i)=>`<tr><td>${pr[i]}</td><td><span class="es">${f}</span><button class="spk sm" data-say="${f}">🔊</button></td></tr>`).join('')}</table>`; }).join(''); const more=tenses.filter(t=>!sel.includes(t)).map(t=>VERBS[t].label.split(' ')[0]).join(', '); return {html:`<b>${verb}</b> 동사 변화표예요.<br>${tables}${more?`<small>"${verb} ${more.split(', ')[0]}" 처럼 물으면 다른 시제도 보여 드려요 (${more}).</small>`:''}`}; }
  // 지식 베이스
  if(window.KB){ const scored=KB.map(e=>({e,s:kbScore(raw,e)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s); if(scored.length){ const top=scored[0].e; const extra=scored.slice(1,3).filter(x=>x.s>=2).map(x=>`<a href="#" data-ask="${x.e.t}">${x.e.t}</a>`); return {html:`<b>📌 ${top.t}</b><br>${top.a}${top.ch?chapterLink(top.ch):''}${extra.length?'<br><small>관련: '+extra.join(' · ')+'</small>':''}`}; } }
  // 현재 장 내용 검색
  if(window.CH){ const toks=words.filter(w=>w.length>=2); const hits=[]; CH.sections.forEach(s=>{ const text=stripHtml((s.title||'')+' '+(s.html||'')+' '+(s.after||'')+' '+(s.items||[]).map(i=>(i.es||i.front||i[0]||'')+' '+(i.ko||i.back||i[1]||'')).join(' ')+' '+(s.rows||[]).map(r=>r.join(' ')).join(' ')); const nt=strip(text.toLowerCase()); const sc=toks.filter(t=>nt.includes(t)).length; if(sc) hits.push({s,sc,text}); }); hits.sort((a,b)=>b.sc-a.sc); if(hits.length){ const h=hits[0]; const idx=strip(h.text.toLowerCase()).indexOf(toks.find(t=>strip(h.text.toLowerCase()).includes(t))||''); const snip=h.text.slice(Math.max(0,idx-60), idx+160).replace(/\s+/g,' '); return {html:`이 장의 <b>"${h.s.title||'학습 내용'}"</b> 부분에 관련 내용이 있어요:<br><small>…${snip}…</small><br>학습 탭에서 해당 섹션을 확인해 보세요.`}; } }
  return null;
}
async function answerAI(q, local){
  const key=localStorage.getItem('dbsg_ai_key'); if(!key) return null;
  const model=localStorage.getItem('dbsg_ai_model')||'gemini-2.0-flash';
  const chap=window.CH?`현재 학습자가 보고 있는 장: ${document.title}`:'학습자는 목차 페이지에 있음';
  const sys=`너는 다인에듀(Dain Edu)의 스페인어 강사 '후안샘'의 AI 조교 '후안샘 봇'이다. 한국인 성인 초급 학습자에게 기초 스페인어 문법을 한국어로 친절하고 간결하게 설명한다. 스페인어 예문은 반드시 포함하고, 예문 뒤에 한국어 뜻을 괄호로 붙인다. 스페인 표준 용법을 기본으로 하되 중남미 용법 차이가 있으면 짧게 덧붙인다. 답은 300자 내외, 필요하면 표 대신 줄바꿈 목록을 사용한다. 문법 외 질문(정치·의학 등)은 정중히 사양하고 스페인어 학습으로 돌아온다. ${chap}.${local?' 사이트 내장 자료 참고: '+stripHtml(local.html).slice(0,800):''}`;
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const body={system_instruction:{parts:[{text:sys}]},contents:[{role:'user',parts:[{text:q}]}],generationConfig:{temperature:0.4,maxOutputTokens:700}};
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok){ const t=await r.text(); throw new Error('API '+r.status+': '+t.slice(0,120)); }
  const j=await r.json(); const txt=j.candidates?.[0]?.content?.parts?.map(p=>p.text).join('')||''; if(!txt) throw new Error('빈 응답');
  // 간단한 마크다운 → HTML
  let h=txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`(.+?)`/g,'<span class="es">$1</span>').replace(/^[-*] (.*)$/gm,'• $1').replace(/\n/g,'<br>');
  return {html:h+'<br><small style="opacity:.6">🤖 AI 답변 — 교재 내용과 다르면 교재를 우선하세요.</small>'};
}
function initChat(){
  if($('.chatfab')) return;
  const fab=el('button','chatfab','<span class="dot"></span>💬 후안샘 봇'); document.body.appendChild(fab);
  const win=el('div','chatwin'); win.innerHTML=`<div class="chathead"><div class="av">🧑‍🏫</div><div><b>후안샘 봇</b><small>기초 스페인어 문법 도우미 · 24시간 질문 OK</small></div><span class="spacer"></span><button class="cset" title="AI 연결 설정">⚙</button><button class="cclose" title="닫기">✕</button></div>
  <div class="chatset"><b>🤖 AI 모드 (선택)</b><br>기본은 교재 지식 베이스로 답하는 오프라인 모드입니다. Google AI Studio의 무료 Gemini API 키를 넣으면 어떤 질문이든 AI가 답합니다. 키는 이 브라우저에만 저장됩니다.<input type="password" class="ckey" placeholder="Gemini API 키 (AIza…)"><input type="text" class="cmodel" placeholder="모델 (기본 gemini-2.0-flash)"><div class="row"><button class="btn p csave">저장</button><button class="btn s cdel">키 삭제</button><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="font-size:12px;font-weight:800;color:var(--blue)">키 발급받기 ↗</a></div></div>
  <div class="chatlog"></div><div class="chatsug"></div><div class="chatin"><input type="text" placeholder="예: ser와 estar 차이 / tener 과거 / 3:45 / 1234"><button>전송</button></div>`;
  document.body.appendChild(win);
  const log=$('.chatlog',win), inp=$('.chatin input',win), send=$('.chatin button',win), sug=$('.chatsug',win), set=$('.chatset',win);
  const add=(html,who)=>{ const m=el('div','msg '+who,html); log.appendChild(m); bindSpk(m); $$('[data-ask]',m).forEach(a=>a.onclick=e=>{e.preventDefault(); ask(a.dataset.ask);}); log.scrollTop=log.scrollHeight; return m; };
  const greet=()=>{ const name=window.CH?document.title.split(' — ')[0]:'목차'; add(`¡Hola! 저는 <b>후안샘 봇</b>이에요 👋<br>지금 <b>${name}</b>을(를) 보고 계시네요. 문법 질문, 동사 변화표(예: "tener 과거"), 숫자·시간 변환(예: "1234", "3:45")을 바로 도와드릴게요.${localStorage.getItem('dbsg_ai_key')?'<br><small>🤖 AI 모드 켜짐</small>':'<br><small>⚙ 버튼에서 Gemini 키를 넣으면 AI 모드로 더 자유롭게 대화할 수 있어요.</small>'}`,'bot'); };
  const SUG=window.CH?[`이 장 핵심 요약`,'ser와 estar 차이','por와 para 차이','tener 현재','3:45 스페인어로','어떻게 공부해야 해요?']:['어디서부터 시작해요?','ser와 estar 차이','과거 vs 불완료','명령형 만드는 법','숫자 2026','7:30 스페인어로'];
  SUG.forEach(s=>{ const b=el('button',null,s); b.onclick=()=>ask(s); sug.appendChild(b); });
  async function ask(q){ if(!q.trim()) return; add(q.replace(/</g,'&lt;'),'user'); inp.value=''; const typing=add('<span></span><span></span><span></span>','bot typing');
    let local=null;
    if(/이 장 핵심 요약|요약/.test(q)&&window.CH){ const secs=CH.sections.filter(s=>s.title).slice(0,8).map(s=>`• ${s.title}`).join('<br>'); local={html:`<b>${document.title.split(' — ')[0]} 핵심</b><br>${esify(CH.intro||'')}<br><br><b>학습 내용</b><br>${secs}<br><br>연습문제 ${CH.exercises.length}개 — 모두 초록색으로 만들면 이 장 완료!`}; }
    else local=answerLocal(q);
    let out=null;
    try{ out=await answerAI(q, local); }catch(e){ console.warn(e); if(localStorage.getItem('dbsg_ai_key')) toast('AI 응답 실패: '+e.message.slice(0,60)); }
    typing.remove();
    if(out) add(out.html,'bot'); else if(local) add(local.html,'bot');
    else add(`음, 그 질문은 제 교재 지식에 없네요 🤔<br>이렇게 물어보세요:<br>• 문법 주제: "현재완료 용법", "qué cuál 차이"<br>• 동사: "poder 미래", "ir 명령형"<br>• 숫자/시간: "15000", "9:15"<br><br>⚙ 설정에서 Gemini API 키를 넣으면 어떤 질문이든 AI가 답해 드려요.`,'bot'); }
  send.onclick=()=>ask(inp.value); inp.onkeydown=e=>{ if(e.key==='Enter') ask(inp.value); };
  fab.onclick=()=>{ win.classList.toggle('open'); if(win.classList.contains('open')){ if(!log.children.length) greet(); setTimeout(()=>inp.focus(),100); } };
  $('.cclose',win).onclick=()=>win.classList.remove('open');
  $('.cset',win).onclick=()=>{ set.classList.toggle('open'); $('.ckey',set).value=localStorage.getItem('dbsg_ai_key')||''; $('.cmodel',set).value=localStorage.getItem('dbsg_ai_model')||''; };
  $('.csave',set).onclick=()=>{ const k=$('.ckey',set).value.trim(); const m=$('.cmodel',set).value.trim(); if(k) localStorage.setItem('dbsg_ai_key',k); else localStorage.removeItem('dbsg_ai_key'); if(m) localStorage.setItem('dbsg_ai_model',m); else localStorage.removeItem('dbsg_ai_model'); set.classList.remove('open'); add(k?'🤖 AI 모드가 켜졌어요. 이제 무엇이든 물어보세요!':'오프라인 모드로 돌아왔어요.','bot'); };
  $('.cdel',set).onclick=()=>{ localStorage.removeItem('dbsg_ai_key'); $('.ckey',set).value=''; set.classList.remove('open'); add('키를 삭제했어요. 오프라인 모드로 답합니다.','bot'); };
  window.askBot=q=>{ win.classList.add('open'); if(!log.children.length) greet(); ask(q); };
}

/* ---------- 공개 ---------- */
window.App={CHAPTERS,PARTS,renderChapter,renderHub,speak,numToEs,timeToEs,toggleTheme,initTheme,loadP,saveP,check,confetti,toast,VERBS};
initTheme();
document.addEventListener('DOMContentLoaded',()=>{
  const tb=$('#themeBtn'); if(tb) tb.onclick=toggleTheme;
  const rb=$('#resetBtn'); if(rb) rb.onclick=()=>{ if(confirm('모든 학습 진도를 초기화할까요?')){ localStorage.removeItem(KEY); location.reload(); } };
  if(window.CH){ renderChapter(window.CH); }
  if($('#hub')) renderHub();
  initChat();
});
})();

/* ---------- 홈페이지(iframe)에 넣었을 때 후안샘 봇이 화면을 따라오게 ----------
   iframe 높이가 내용 전체 높이로 늘어나 있으면 position:fixed가 iframe 맨 아래에 붙어 버립니다.
   IntersectionObserver로 '부모 화면에서 실제로 보이는 영역'을 계산해 버튼과 채팅창을 그 아래쪽에 둡니다. */
(function(){
  if(window.self===window.top || !('IntersectionObserver' in window)) return;
  const STRIP=80; let strips=[], rects=new Map(), io=null, vis=null, raf=0;
  const internalScroll=()=> document.documentElement.scrollHeight > window.innerHeight+40;
  function place(){ raf=0; const fab=document.querySelector('.chatfab'), win=document.querySelector('.chatwin'); if(!fab) return;
    if(internalScroll()||!vis){ fab.classList.remove('follow'); fab.style.top=''; if(win){ win.classList.remove('follow'); win.style.top=''; win.style.height=''; } return; }
    fab.classList.add('follow'); const fh=fab.offsetHeight||56; const sy=window.scrollY||0;
    const fabTop=Math.max(vis.top+10, vis.bottom-fh-22); fab.style.top=(fabTop+sy)+'px';
    if(win){ win.classList.add('follow'); const avail=vis.bottom-vis.top-fh-50; const wh=Math.max(300, Math.min(600, avail)); win.style.height=wh+'px'; win.style.top=(Math.max(vis.top+10, fabTop-wh-12)+sy)+'px'; } }
  const schedule=()=>{ if(!raf) raf=requestAnimationFrame(place); };
  function recompute(){ let t=Infinity,b=-Infinity; rects.forEach(r=>{ if(r.height>0){ t=Math.min(t,r.top); b=Math.max(b,r.bottom); } }); vis=(b>t)?{top:t,bottom:b}:null; schedule(); }
  function build(){ if(io) io.disconnect(); strips.forEach(s=>s.remove()); strips=[]; rects.clear();
    const H=Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    let host=document.getElementById('followStrips'); if(!host){ host=document.createElement('div'); host.id='followStrips'; host.setAttribute('aria-hidden','true'); host.style.cssText='position:absolute;left:0;top:0;width:1px;height:0;pointer-events:none;visibility:hidden;z-index:-1'; document.body.appendChild(host); }
    io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting) rects.set(e.target,e.intersectionRect); else rects.delete(e.target); }); recompute(); },{threshold:[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1]});
    for(let y=0;y<H;y+=STRIP){ const s=document.createElement('div'); s.style.cssText=`position:absolute;left:0;top:${y}px;width:1px;height:${Math.min(STRIP,H-y)}px`; host.appendChild(s); strips.push(s); io.observe(s); } }
  let rt=0; const rebuild=()=>{ clearTimeout(rt); rt=setTimeout(build,250); };
  window.addEventListener('load',build); setTimeout(build,600);
  if('ResizeObserver' in window) new ResizeObserver(rebuild).observe(document.body); else window.addEventListener('resize',rebuild);
  document.addEventListener('click',e=>{ if(e.target.closest('.chatfab,.chatwin')) setTimeout(place,0); });
})();
