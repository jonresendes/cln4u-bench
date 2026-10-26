/* ═══════════════════════════════════════════════════════════
   core.js — constants, storage, question pool engine,
   profiles, leaderboard, badges, gates, seals & accolades, UI helpers
   THE BENCH · CLN4U Review Arena
   ═══════════════════════════════════════════════════════════ */
'use strict';

const APP = {name:"The Bench",sub:"CLN4U Review Arena",course:"CLN4U · Canadian and International Law",mantra:"“Understand the System — Then Question It.”",lsPrefix:"bench."};

const UNITS = {
  1:{n:1,title:"The Legal Mind",short:"Legal Mind",tag:"The scales — jurisprudence, reasoning, and the rule of law.",lens:"Why law? Whose morals? Where does authority come from?",lessons:["What Is Law?","Moral & Legal Reasoning","Foundations of Canadian Law (Part 1)","Foundations of Canadian Law (Part 2)","How Law Is Made in Canada","Justice System Roles & Ethics","Investigating Contemporary Issues"],badgeName:"Scales"},
  2:{n:2,title:"Legal Foundations",short:"Foundations",tag:"The gavel — courts, sources of law, and landmark cases.",lens:"“Understand the System — Then Question It.”",lessons:["The Skin I'm In & Racial Profiling","Ontario's Court System","Why Do People Obey — or Break — the Law?","The Roots and Sources of Canadian Law","Landmark Cases in Canadian Law","Comparative Justice: Canada & the U.S."],badgeName:"Gavel"},
  3:{n:3,title:"Human Rights",short:"Human Rights",tag:"The maple leaf — the Charter, the UDHR, and rights recognized.",lens:"“Rights Are Not Given — They Are Recognized.”",lessons:["What Are Human Rights?","The Charter, Section by Section (Part 1)","The Charter, Section by Section (Part 2)","The Universal Declaration of Human Rights","Universalism vs. Relativism: Situatedness","Historical Abuses: Mandela & Rwanda","Malala & the Hidden Labour Behind AI","ICE & Guantánamo Bay"],badgeName:"Maple Leaf"},
  4:{n:4,title:"Crime and Criminal Law",short:"Criminal Law",tag:"The shield — from a coerced confession to the Rome Statute.",lens:"“The System Is Only as Just as Its Weakest Case.”",lessons:["Foundations of Criminal Law","From Arrest to Trial","Wrongful Convictions I: Central Park Five","Wrongful Convictions II: West Memphis Three","Wrongful Convictions III: David Milgaard","International Criminal Law: Nuremberg to the ICC","Synthesis: Crime, Justice, and Accountability"],badgeName:"Shield"},
  0:{n:0,title:"All Units — Exam Study",short:"All Units",tag:"The globe — every unit, every question.",lens:"",lessons:[],badgeName:"Globe"}
};
const TOPICS = ["Vocabulary","Cases & Rulings","Laws & Documents","People & Institutions","Theories & Concepts","Modern Connections"];
const TOPIC_DESC = {Vocabulary:"Key terms & definitions",'Cases & Rulings':"Landmark cases & what they decided",'Laws & Documents':"Charter sections, statutes, treaties",'People & Institutions':"Thinkers, judges, courts & bodies",'Theories & Concepts':"Schools of thought & big ideas",'Modern Connections':"Current issues & today's headlines"};
const DIFFS = [
  {id:0,name:"Remedial",desc:"Recognition & recall",pts:100},
  {id:1,name:"Level 1",desc:"Definitions & names",pts:200},
  {id:2,name:"Level 2",desc:"Understanding ideas",pts:300},
  {id:3,name:"Level 3",desc:"Applying to new cases",pts:400},
  {id:4,name:"Level 4",desc:"Analysis & synthesis",pts:500},
  {id:"mix",name:"Mixed",desc:"Climb through all levels",pts:300}
];
const GAMES = {
  jeopardy:{id:"jeopardy",name:"Jeopardy",glyph:"J!",desc:"Pick a category and a value. Daily Doubles hide on the board; wrong answers cost you.",meta:"5 categories · 25 clues · steals in head-to-head",h2h:true},
  wheel:{id:"wheel",name:"Wheel of Justice",glyph:"◎",desc:"Spin the wheel, call consonants, buy vowels and solve the legal term, case or name before the others.",meta:"5 puzzles · bankrupt & lose-a-turn · solve bonus",h2h:true},
  millionaire:{id:"millionaire",name:"Who Wants to Be Chief Justice?",glyph:"⚖",desc:"Climb a 15-question ladder with three lifelines. Safe havens at 5 and 10. Walk away any time.",meta:"15 rungs · 50:50 · ask the jury · swap",h2h:true},
  sprint:{id:"sprint",name:"Lightning Round",glyph:"⚡",desc:"Rapid-fire questions with a streak multiplier. In head-to-head mode, buzz in first to answer.",meta:"timed sprint · buzzers · streak bonus",h2h:true}
};
const TEAM_COLORS = ["#d4a74a","#4f9ee8","#e4475b","#9b7cf5"];
const TEAM_KEYS = ["1","2","3","4"];
const UNIT_COLORS = {1:"#d4a74a",2:"#4f9ee8",3:"#e4475b",4:"#9b7cf5",0:"#cfc6b2"};
const DEFAULT_TEAMS = ["Crown","Defence"];
const EXTRA_TEAMS = ["Osgoode","Runnymede","The Hague","Appellants","Respondents","Jurors","Barristers","Solicitors"];

/* ── question bank prep ── */
const BANK = (window.QBANK||[]).map((q,i)=>Object.assign({id:"q"+i},q));
const LESSONS = (window.LESSONS||[]);
const WHEEL_RE = /^[A-Za-z0-9 ,'’\-\.\/&:()]+$/;
function wheelEligible(q){ return WHEEL_RE.test(q.a) && q.a.length<=30 && q.a.replace(/[^A-Za-z]/g,"").length>=4 && !/[0-9]/.test(q.a); }

/* ── storage ── */
const LS = {
  get(k,d){ try{const v=localStorage.getItem(APP.lsPrefix+k); return v==null?d:JSON.parse(v);}catch(e){return d;} },
  set(k,v){ try{localStorage.setItem(APP.lsPrefix+k,JSON.stringify(v));}catch(e){} },
  del(k){ try{localStorage.removeItem(APP.lsPrefix+k);}catch(e){} },
  keys(){ const out=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); if(k&&k.startsWith(APP.lsPrefix)) out.push(k.slice(APP.lsPrefix.length));} return out; }
};

/* ── helpers ── */
const rnd = (n)=>Math.floor(Math.random()*n);
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; }
function pick(a){ return a[rnd(a.length)]; }
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fmt(n){ return (n<0?"−":"")+Math.abs(n).toLocaleString(); }
function el(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
function $(sel,root){ return (root||document).querySelector(sel); }
function $$(sel,root){ return Array.from((root||document).querySelectorAll(sel)); }
function todayISO(){ return new Date().toISOString().slice(0,10); }

/* ── profiles ── */
const Profile = {
  all(){ return LS.get("profiles",[]); },
  currentName(){ return LS.get("profile","") ; },
  current(){ const n=this.currentName(); if(!n) return null; return this.get(n); },
  blank(name){ return {name,created:todayISO(),stats:{games:0,answered:0,correct:0,fast:0,bestStreak:0,byGame:{},byUnit:{}},badges:{},accolades:{},gates:{},seals:{},seen:{},read:{},readDone:{}}; },
  get(name){
    const p=LS.get("p."+name,null);
    if(!p) return this.blank(name);
    // forward-compat for older profiles
    p.gates=p.gates||{}; p.seals=p.seals||{}; p.read=p.read||{}; p.readDone=p.readDone||{}; p.accolades=p.accolades||{}; p.badges=p.badges||{};
    return p;
  },
  save(p){ LS.set("p."+p.name,p); const all=this.all(); if(!all.includes(p.name)){all.push(p.name);LS.set("profiles",all);} },
  select(name){ LS.set("profile",name); const p=this.get(name); this.save(p); },
  remove(name){ LS.del("p."+name); LS.set("profiles",this.all().filter(n=>n!==name)); if(this.currentName()===name) LS.del("profile"); }
};

/* ── no-repeat question pool engine ──
   Pool key = units + difficulty + topics. Used ids persist per device (shared across profiles,
   so a class tablet keeps cycling through fresh questions). */
const Pool = {
  key(cfg){ return [cfg.units.slice().sort().join("-"),"d"+cfg.diff,cfg.topics.slice().sort().join(",")].join("|"); },
  base(cfg){ return BANK.filter(q=>(cfg.units.includes(0)||cfg.units.includes(q.u)) && cfg.topics.includes(q.t)); },
  sizeFor(cfg){ const b=this.base(cfg); if(cfg.diff==="mix") return b.length; return b.filter(q=>q.d===cfg.diff).length; },
  used(cfg){ return new Set(LS.get("used."+this.key(cfg),[])); },
  markUsed(cfg,ids){ const s=this.used(cfg); ids.forEach(i=>s.add(i)); LS.set("used."+this.key(cfg),Array.from(s)); },
  reset(cfg){ LS.del("used."+this.key(cfg)); },
  resetAll(){ LS.keys().filter(k=>k.startsWith("used.")).forEach(k=>LS.del(k)); },
  /* draw(cfg, n, opts): opts.level (exact level), opts.topic, opts.wheel(bool), opts.exclude(Set)
     Returns {qs:[...], recycled:bool}. Pads from nearest difficulty levels when the exact level is short. */
  draw(cfg,n,opts){
    opts=opts||{};
    const base=this.base(cfg).filter(q=>!(opts.exclude&&opts.exclude.has(q.id)) && (!opts.topic||q.t===opts.topic) && (!opts.wheel||wheelEligible(q)));
    const target = opts.level!=null ? opts.level : (cfg.diff==="mix"?null:cfg.diff);
    const used=this.used(cfg);
    const ordered = [];
    if(target==null){ ordered.push(base); }
    else{ const levels=[0,1,2,3,4].sort((a,b)=>Math.abs(a-target)-Math.abs(b-target)||a-b); levels.forEach(l=>ordered.push(base.filter(q=>q.d===l))); }
    let out=[], recycled=false;
    for(const group of ordered){ if(out.length>=n) break; out=out.concat(shuffle(group.filter(q=>!used.has(q.id))).slice(0,n-out.length)); }
    if(out.length<n){
      recycled=true; const have=new Set(out.map(q=>q.id));
      for(const group of ordered){ if(out.length>=n) break; out=out.concat(shuffle(group.filter(q=>!have.has(q.id))).slice(0,n-out.length)); }
    }
    if(recycled){ const allIds=new Set(base.map(q=>q.id)); let allUsed=true; for(const id of allIds){ if(!used.has(id)){allUsed=false;break;} } if(allUsed){ this.reset(cfg); } }
    // NOTE: questions are marked "used" only when actually shown (Session.present).
    return {qs:out,recycled};
  },
  progress(cfg){ const b=this.base(cfg); const tot=cfg.diff==="mix"?b.length:b.filter(q=>q.d===cfg.diff).length; const u=this.used(cfg); let c=0; b.forEach(q=>{ if((cfg.diff==="mix"||q.d===cfg.diff)&&u.has(q.id)) c++; }); return {used:c,total:tot}; }
};

/* ── choices builder ── */
function buildChoices(q){ const opts=shuffle([q.a].concat(q.x)); return opts.map(t=>({t,ok:t===q.a})); }

/* ── scoring ── */
function basePoints(q,cfg){ return DIFFS.find(d=>d.id===q.d).pts; }
function speedBonus(base,remaining,total){ if(!total) return 0; return Math.round(base*0.5*Math.max(0,remaining)/total); }

/* ── timer ── */
class Timer{
  constructor(sec,onTick,onEnd){ this.total=sec; this.left=sec; this.onTick=onTick; this.onEnd=onEnd; this.h=null; this.running=false; }
  start(){ this.stop(); this.running=true; this.t0=performance.now(); this.h=setInterval(()=>{ const e=(performance.now()-this.t0)/1000; this.left=Math.max(0,this.total-e); this.onTick&&this.onTick(this.left,this.total); if(this.left<=0){this.stop(); this.onEnd&&this.onEnd();} },100); return this; }
  stop(){ if(this.h){clearInterval(this.h);} this.h=null; this.running=false; }
  elapsed(){ return this.total-this.left; }
}

/* ── leaderboard ── */
const Board = {
  all(){ return LS.get("board",[]); },
  add(e){ const b=this.all(); b.push(Object.assign({date:todayISO(),ts:Date.now()},e)); b.sort((a,b)=>b.score-a.score); LS.set("board",b.slice(0,500)); },
  top(filter,n){ let b=this.all(); if(filter){ b=b.filter(e=>(!filter.game||e.game===filter.game)&&(filter.unit==null||e.unit===filter.unit)&&(!filter.diff&&filter.diff!==0||String(e.diff)===String(filter.diff))); } return b.slice(0,n||10); },
  clear(){ LS.set("board",[]); }
};

/* ── Study Room ──
   Reading-time rule: a lesson counts as read once it has been open for a time proportional to its length —
   words ÷ 3 seconds (≈180 wpm), clamped to 25 s … 240 s. Partial time accumulates per profile. */
const Study = {
  lessons(u){ return LESSONS.filter(L=>L.u===u).sort((a,b)=>a.l-b.l); },
  get(u,l){ return LESSONS.find(L=>L.u===u&&L.l===l); },
  words(L){ return L.sections.reduce((n,s)=>n+(s.h+" "+s.items.join(" ")).split(/\s+/).length,0)+ (L.title+" "+(L.sub||"")).split(/\s+/).length; },
  required(L){ return Math.max(25,Math.min(240,Math.round(this.words(L)/3))); },
  key(u,l){ return u+":"+l; },
  progress(p,u,l){ const L=this.get(u,l); if(!L||!p) return {sec:0,req:1,done:false}; const sec=p.read[this.key(u,l)]||0; const req=this.required(L); return {sec,req,done:!!p.readDone[this.key(u,l)]||sec>=req}; },
  unitDone(p,u){ const ls=this.lessons(u); return ls.length>0 && ls.every(L=>this.progress(p,u,L.l).done); },
  unitCount(p,u){ return this.lessons(u).filter(L=>this.progress(p,u,L.l).done).length; },
  addTime(p,u,l,sec){ const k=this.key(u,l); p.read[k]=(p.read[k]||0)+sec; const pr=this.progress(p,u,l); if(pr.done&&!p.readDone[k]) p.readDone[k]=todayISO(); Profile.save(p); return pr; }
};

/* ── badges (per unit, unit-coloured) ── */
const BADGE_DEFS = [
  {id:"initiate",name:"Initiate",desc:"Play any game in this unit",test:(p,u)=>(p.stats.byUnit[u]?.games||0)>=1,prog:(p,u)=>[Math.min(1,p.stats.byUnit[u]?.games||0),1]},
  {id:"scholar",name:"Scholar",desc:"Finish a game with 70%+ correct",test:(p,u)=>!!p.stats.byUnit[u]?.scholar},
  {id:"sage",name:"Sage",desc:"70%+ correct at Level 4",test:(p,u)=>!!p.stats.byUnit[u]?.sage},
  {id:"grandmaster",name:"Grand Master",desc:"Play all four games in this unit",test:(p,u)=>Object.keys(p.stats.byUnit[u]?.games_by||{}).length>=4,prog:(p,u)=>[Object.keys(p.stats.byUnit[u]?.games_by||{}).length,4]},
  {id:"completionist",name:"Completionist",desc:"See every question in this unit at least once",test:(p,u)=>unitSeen(p,u)>=unitTotal(u),prog:(p,u)=>[unitSeen(p,u),unitTotal(u)]},
  {id:"swift",name:"Swift Mind",desc:"10 correct answers under 5s in one timed game",test:(p,u)=>!!p.stats.byUnit[u]?.swift},
  {id:"lamp",name:"Scholar's Lamp",desc:"Read every lesson of this unit in the Study Room",test:(p,u)=>Study.unitDone(p,u),prog:(p,u)=>[Study.unitCount(p,u),Study.lessons(u).length]}
];
function unitTotal(u){ return BANK.filter(q=>q.u===u).length; }
function unitSeen(p,u){ let c=0; for(const id in p.seen){ const q=BANK[+id.slice(1)]; if(q&&q.u===u) c++; } return c; }
function unitAnswered(p,u){ return p.stats.byUnit[u]?.answered||0; }
function unitAccuracy(p,u){ const b=p.stats.byUnit[u]; return b&&b.answered?b.correct/b.answered:0; }

/* ── Gates (three per unit, cumulative) ──
   Gate I   Articling      — 50+ questions answered in the unit, 60%+ accuracy, Initiate badge.
   Gate II  Called to Bar  — 150+ answered, 70%+ accuracy, Scholar badge, 2+ different games played.
   Gate III Bencher        — 300+ answered, 75%+ accuracy, Sage badge, Scholar's Lamp, all four games. */
const GATE_DEFS = [
  {id:1,name:"Gate I · Articling",short:"Articling",desc:"50 answered · 60% accuracy · Initiate",test:(p,u)=>unitAnswered(p,u)>=50&&unitAccuracy(p,u)>=.6&&!!p.badges[u+":initiate"],prog:(p,u)=>[Math.min(unitAnswered(p,u),50),50]},
  {id:2,name:"Gate II · Called to the Bar",short:"Called to the Bar",desc:"150 answered · 70% accuracy · Scholar · 2 games",test:(p,u)=>unitAnswered(p,u)>=150&&unitAccuracy(p,u)>=.7&&!!p.badges[u+":scholar"]&&Object.keys(p.stats.byUnit[u]?.games_by||{}).length>=2,prog:(p,u)=>[Math.min(unitAnswered(p,u),150),150]},
  {id:3,name:"Gate III · Bencher",short:"Bencher",desc:"300 answered · 75% accuracy · Sage · Scholar's Lamp · all 4 games",test:(p,u)=>unitAnswered(p,u)>=300&&unitAccuracy(p,u)>=.75&&!!p.badges[u+":sage"]&&!!p.badges[u+":lamp"]&&!!p.badges[u+":grandmaster"],prog:(p,u)=>[Math.min(unitAnswered(p,u),300),300]}
];
function gateLevel(p,u){ let g=0; GATE_DEFS.forEach(d=>{ if(p.gates[u+":"+d.id]) g=d.id; }); return g; }

/* ── Golden tier: seal codes (hidden). Codes are stored hashed; plain codes are in the README (teacher only).
   Entering a unit's code grants that unit's Golden Seal; all four seals = the Golden Bench. */
function sealHash(s){ s=String(s).toUpperCase().replace(/[^A-Z0-9]/g,""); let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0; return h.toString(16); }
const SEALS = {1:"7f9b35a9",2:"bfd669ac",3:"bcb913ea",4:"1c859902"};
function redeemSeal(p,code){ const h=sealHash(code); for(const u of [1,2,3,4]){ if(SEALS[u]===h){ if(p.seals[u]) return {ok:true,unit:+u,dup:true}; p.seals[u]=todayISO(); Profile.save(p); return {ok:true,unit:+u}; } } return {ok:false}; }
function goldenBench(p){ return [1,2,3,4].every(u=>p.seals[u]); }

/* ── accolades (global) ── */
const ACCOLADE_DEFS = [
  {id:"first",name:"First Steps",desc:"Finish your first game",test:p=>p.stats.games>=1},
  {id:"perfect",name:"Flawless",desc:"100% correct in a game of 10+ questions",test:p=>!!p.stats.perfect},
  {id:"streak10",name:"Hot Streak",desc:"10 correct answers in a row",test:p=>p.stats.bestStreak>=10},
  {id:"king",name:"Chief Justice",desc:"Reach the top rung in Chief Justice",test:p=>!!p.stats.king},
  {id:"wizard",name:"Wheel Wizard",desc:"Solve a puzzle with 3 or fewer letters revealed",test:p=>!!p.stats.wizard},
  {id:"dd",name:"Double Down",desc:"Win a Daily Double wager",test:p=>!!p.stats.dd},
  {id:"lightning",name:"Lightning Rod",desc:"15+ correct in one Lightning Round",test:p=>!!p.stats.lightning},
  {id:"exam",name:"Exam Ready",desc:"70%+ on All Units at Level 3 or higher",test:p=>!!p.stats.exam},
  {id:"purist",name:"Purist",desc:"Finish a Level 4 game with the timer off",test:p=>!!p.stats.purist},
  {id:"speed",name:"Speed Demon",desc:"Average under 4s per answer in a timed game (10+ Qs)",test:p=>!!p.stats.speed},
  {id:"polymath",name:"Polymath",desc:"Earn a badge in all four units",test:p=>[1,2,3,4].every(u=>Object.keys(p.badges).some(k=>k.startsWith(u+":")))},
  {id:"marathon",name:"Marathon",desc:"Answer 250 questions in total",test:p=>p.stats.answered>=250},
  {id:"rival",name:"Rivalry",desc:"Win a head-to-head game",test:p=>!!p.stats.h2hwin},
  {id:"cycle",name:"Full Cycle",desc:"Exhaust an entire question pool",test:p=>!!p.stats.cycle},
  {id:"librarian",name:"Librarian",desc:"Earn the Scholar's Lamp in all four units",test:p=>[1,2,3,4].every(u=>!!p.badges[u+":lamp"])},
  {id:"valedictorian",name:"Valedictorian",desc:"Pass Gate III in all four units and earn Librarian",test:p=>[1,2,3,4].every(u=>!!p.gates[u+":3"])&&!!p.accolades.librarian},
  {id:"laureate",name:"Laureate",desc:"Earn every other accolade",test:p=>ACCOLADE_DEFS.filter(a=>a.id!=="laureate").every(a=>p.accolades[a.id])}
];

/* Re-check badges, gates and accolades; returns newly unlocked things */
function checkUnlocks(p){
  const unlocked=[];
  [1,2,3,4].forEach(un=>{ BADGE_DEFS.forEach(b=>{ const k=un+":"+b.id; if(!p.badges[k]&&b.test(p,un)){ p.badges[k]=todayISO(); unlocked.push({type:"badge",unit:un,def:b}); } }); });
  [1,2,3,4].forEach(un=>{ GATE_DEFS.forEach(g=>{ const k=un+":"+g.id; if(!p.gates[k]&&g.test(p,un)){ p.gates[k]=todayISO(); unlocked.push({type:"gate",unit:un,def:g}); } }); });
  for(let pass=0;pass<3;pass++) ACCOLADE_DEFS.forEach(a=>{ if(!p.accolades[a.id]&&a.test(p)){ p.accolades[a.id]=todayISO(); unlocked.push({type:"accolade",def:a}); } });
  Profile.save(p);
  return unlocked;
}

/* Record a finished game for a profile; returns list of newly unlocked things */
function recordGame(p,res){
  // res: {game,unit,diff,timed,answered,correct,fast,bestStreak,score,h2hWin,recycled,flags:{king,wizard,dd},avgTime,seen,perUnit:{u:{answered,correct}}}
  const s=p.stats; s.games++; s.answered+=res.answered; s.correct+=res.correct; s.fast+=res.fast||0; s.bestStreak=Math.max(s.bestStreak,res.bestStreak||0);
  s.byGame[res.game]=(s.byGame[res.game]||0)+1;
  const u=res.unit; s.byUnit[u]=s.byUnit[u]||{games:0,games_by:{},answered:0,correct:0}; const bu=s.byUnit[u]; bu.games++; bu.games_by[res.game]=1;
  // per-unit answered/correct (for Gates). All-Units games credit each question's own unit.
  const per=res.perUnit||{[u]:{answered:res.answered,correct:res.correct}};
  Object.keys(per).forEach(k=>{ const uu=+k; if(!uu) return; s.byUnit[uu]=s.byUnit[uu]||{games:0,games_by:{},answered:0,correct:0}; s.byUnit[uu].answered=(s.byUnit[uu].answered||0)+per[k].answered; s.byUnit[uu].correct=(s.byUnit[uu].correct||0)+per[k].correct; });
  const pct=res.answered?res.correct/res.answered:0;
  if(pct>=.7&&res.answered>=5) bu.scholar=true;
  if(pct>=.7&&res.answered>=5&&res.diff===4) bu.sage=true;
  if(res.timed&&(res.fast||0)>=10) bu.swift=true;
  if(pct===1&&res.answered>=10) s.perfect=true;
  if(res.flags){ Object.keys(res.flags).forEach(k=>{ if(res.flags[k]) s[k]=true; }); }
  if(res.game==="sprint"&&res.correct>=15) s.lightning=true;
  if(u===0&&pct>=.7&&res.answered>=10&&(res.diff===3||res.diff===4)) s.exam=true;
  if(!res.timed&&res.diff===4&&res.answered>=10) s.purist=true;
  if(res.timed&&res.answered>=10&&res.avgTime&&res.avgTime<4) s.speed=true;
  if(res.h2hWin) s.h2hwin=true;
  if(res.recycled) s.cycle=true;
  (res.seen||[]).forEach(id=>p.seen[id]=1);
  return checkUnlocks(p);
}

/* ── UI helpers ── */
function toast(title,sub,icon){
  const t=el(`<div class="toast"><div class="t-ic"><svg><use href="#${icon||'ic-badge'}"/></svg></div><div><b>${esc(title)}</b>${sub?`<span>${esc(sub)}</span>`:""}</div></div>`);
  $("#toasts").appendChild(t); setTimeout(()=>{t.style.transition="opacity .4s";t.style.opacity="0";setTimeout(()=>t.remove(),400);},3600);
}
function modal(html,opts){
  const m=$("#modal"); m.innerHTML=`<div class="box ${opts&&opts.wide?'wide':''}">${html}</div>`; m.hidden=false;
  m.onclick=(e)=>{ if(e.target===m && !(opts&&opts.sticky)) closeModal(); };
  return m.firstElementChild;
}
function closeModal(){ const m=$("#modal"); m.hidden=true; m.innerHTML=""; }
function setUnitTheme(u){ document.body.dataset.unit=String(u); }
function emblem(u,cls){ return `<span class="emblem ${cls||''}"><svg><use href="#em-${u}"/></svg></span>`; }
function diffName(d){ const x=DIFFS.find(z=>String(z.id)===String(d)); return x?x.name:String(d); }
function unitShort(u){ return UNITS[u]?UNITS[u].short:"?"; }
function unitColor(u){ return UNIT_COLORS[u]||UNIT_COLORS[0]; }
function pctStr(c,a){ return a?Math.round(100*c/a)+"%":"—"; }

/* ── display: orientation & fullscreen ── */
const Display = {
  orient:LS.get("orient","auto"),
  apply(){ document.body.dataset.orient=this.orient; this.lock(); },
  set(v){ this.orient=v; LS.set("orient",v); this.apply(); },
  async lock(){ try{ if(!screen.orientation||!screen.orientation.lock) return; if(this.orient==="auto"){ if(screen.orientation.unlock) screen.orientation.unlock(); return; } if(document.fullscreenElement) await screen.orientation.lock(this.orient); }catch(e){} },
  isFs(){ return !!(document.fullscreenElement||document.webkitFullscreenElement); },
  async toggleFs(){ try{ if(this.isFs()){ if(document.exitFullscreen) await document.exitFullscreen(); else if(document.webkitExitFullscreen) document.webkitExitFullscreen(); } else { const d=document.documentElement; if(d.requestFullscreen) await d.requestFullscreen({navigationUI:"hide"}); else if(d.webkitRequestFullscreen) d.webkitRequestFullscreen(); await this.lock(); } }catch(e){ toast("Fullscreen unavailable","Use your browser's fullscreen or install the app","ic-fullscreen"); } }
};

/* light sound feedback (no assets; WebAudio) */
const Sfx = {
  ctx:null, on:LS.get("sfx",true),
  beep(freq,dur,type,vol){ if(!this.on) return; try{ this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)(); const o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type=type||"sine"; o.frequency.value=freq; g.gain.value=vol||.06; o.connect(g); g.connect(this.ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+(dur||.15)); o.stop(this.ctx.currentTime+(dur||.15)); }catch(e){} },
  ok(){ this.beep(660,.12); setTimeout(()=>this.beep(990,.18),90); },
  no(){ this.beep(180,.25,"sawtooth",.05); },
  tick(){ this.beep(1200,.04,"square",.02); },
  spin(){ this.beep(440,.08,"triangle",.04); },
  win(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>this.beep(f,.2),i*110)); }
};
