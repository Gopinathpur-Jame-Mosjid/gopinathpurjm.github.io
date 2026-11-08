/* চাঁদা, বাজেট/ফান্ড, মাদ্রাসা, সভা, সম্পত্তি, রমজান, লগ, ব্যাকআপ, WhatsApp শেয়ার, লেনদেন সম্পাদনা */
(function(){
let ex={};try{ex=JSON.parse(localStorage.gm_extra||'{}')}catch(e){}
ex.chanda=ex.chanda||{subs:[],paid:{}};ex.budget=ex.budget||{};ex.mad=ex.mad||{st:[],att:{}};ex.min=ex.min||[];ex.ast=ex.ast||[];ex.log=ex.log||[];
const sv=()=>{try{localStorage.gm_extra=JSON.stringify(ex)}catch(e){toast('স্টোরেজ পূর্ণ')}},bn=n=>Number(n).toLocaleString('bn-BD',{useGrouping:false}),today=()=>new Date().toISOString().slice(0,10);
let cm=today().slice(0,7),md=today();
const txs=()=>[...db.donations.map(x=>({...x,kind:'আয়'})),...db.accounts],yr=String(new Date().getFullYear());
const PAGES={chanda:['মাসিক চাঁদা','💳'],budget:['বাজেট ও ফান্ড','📊'],madrasa:['মাদ্রাসা/মক্তব','🎓'],minutes:['সভার সিদ্ধান্ত','📝'],assets:['সম্পত্তি ও সরঞ্জাম','🧰'],ramadan:['সেহরি ও ইফতার','🌙'],log:['পরিবর্তনের লগ ও ব্যাকআপ','🕓']};
const nav=$('#nav');Object.entries(PAGES).forEach(([k,v])=>nav.insertAdjacentHTML('beforeend',`<button class="nav-item" data-page="${k}">${v[1]} <span>${v[0]}</span></button>`));
const tb=(t,b,a)=>`<div class="toolbar"><h2>${t}</h2>${a?`<button class="btn" data-add="${a}">＋ ${b}</button>`:''}</div>`;
const del=(k,id)=>`<button class="btn danger small" data-del="${k}:${id}">মুছুন</button>`;
const P={
chanda(){const s=ex.chanda.subs,pd=ex.chanda.paid[cm]||[],got=s.filter(x=>pd.includes(x.id)),due=s.filter(x=>!pd.includes(x.id));
 return tb('মাসিক চাঁদা','সদস্য যোগ','chanda')+`<div class="field"><label>মাস</label><input class="input" type="month" id="cm" value="${cm}"></div><div class="grid stats"><div class="stat"><div class="stat-top">পরিশোধ</div><strong>${bn(got.length)}</strong><small>${money(sum(got,'amt'))}</small></div><div class="stat"><div class="stat-top">বাকি</div><strong>${bn(due.length)}</strong><small>${money(sum(due,'amt'))}</small></div></div><div class="panel">${s.map(x=>`<label class="tx"><span><input type="checkbox" data-pay="${x.id}" ${pd.includes(x.id)?'checked':''}> <b>${esc(x.name)}</b><small>${money(x.amt)}</small></span>${del('chanda',x.id)}</label>`).join('')||'<div class="empty">কোনো সদস্য নেই</div>'}</div>`},
budget(){const spent={},fund={};txs().forEach(x=>{const k=x.sourceFund||x.category||'সাধারণ';fund[k]=(fund[k]||0)+(x.kind==='আয়'?1:-1)*Number(x.amount||0);if(x.kind==='ব্যয়'&&(x.date||'').startsWith(yr))spent[x.category||'অন্যান্য']=(spent[x.category||'অন্যান্য']||0)+Number(x.amount||0)});
 const cats=[...new Set([...Object.keys(ex.budget),...Object.keys(spent)])];
 return `<div class="toolbar"><h2>বাজেট বনাম খরচ (${yr})</h2></div><div class="notice-banner">খাতের পাশে বাজেট লিখুন। খরচ বেশি হলে লাল হবে।</div><div class="panel">${cats.map(c=>{const l=ex.budget[c]||0,s=spent[c]||0,over=l&&s>l;return `<div class="tx"><div><b>${esc(c)}</b><small style="color:${over?'#c0392b':'inherit'}">খরচ ${money(s)}${l?' / বাজেট '+money(l):''}${over?' ⚠ সীমা ছাড়িয়েছে':''}</small></div><input class="input" type="number" style="width:110px" placeholder="বাজেট" data-bl="${esc(c)}" value="${l||''}"></div>`}).join('')||'<div class="empty">ব্যয়ের এন্ট্রি দিলে খাত আসবে</div>'}</div><div class="section-head"><h3>ফান্ডভিত্তিক ব্যালেন্স</h3></div>`+table(['ফান্ড','ব্যালেন্স'],Object.entries(fund).map(([k,v])=>[k,money(v)]))},
madrasa(){const st=ex.mad.st,a=ex.mad.att[md]||[];
 return tb('মাদ্রাসা/মক্তব — উপস্থিতি','ছাত্র যোগ','stu')+`<div class="field"><label>তারিখ</label><input class="input" type="date" id="md" value="${md}"></div><div class="notice-banner">উপস্থিত: ${bn(a.length)} / ${bn(st.length)}</div><div class="panel">${st.map(x=>`<label class="tx"><span><input type="checkbox" data-att="${x.id}" ${a.includes(x.id)?'checked':''}> <b>${esc(x.name)}</b><small>মাসিক বেতন ${money(x.fee)}</small></span>${del('stu',x.id)}</label>`).join('')||'<div class="empty">কোনো ছাত্র নেই</div>'}</div>`},
minutes(){return tb('সভার সিদ্ধান্ত','নতুন সভা','min')+ex.min.slice().reverse().map(x=>`<div class="panel" style="margin-bottom:11px"><span class="tag">${esc(x.date)}</span><h3>${esc(x.title)}</h3><p class="muted" style="white-space:pre-wrap">${esc(x.body)}</p>${del('min',x.id)}</div>`).join('')||'<div class="panel empty">কোনো সভা লেখা নেই</div>'},
assets(){return tb('সম্পত্তি ও সরঞ্জাম','যোগ','ast')+table(['নাম','সংখ্যা','অবস্থা'],ex.ast.map(x=>[x.name,x.qty,x.note]))+ex.ast.map(x=>`<div class="tx"><span>${esc(x.name)}</span>${del('ast',x.id)}</div>`).join('')},
ramadan(){const sh=ex.sehri||'',f=db.prayer['ফজর'];
 return `<div class="toolbar"><h2>সেহরি ও ইফতার</h2></div><div class="grid stats"><div class="stat"><div class="stat-top">ইফতার (মাগরিব)</div><strong>${esc(db.prayer['মাগরিব'])}</strong></div><div class="stat"><div class="stat-top">সেহরির শেষ</div><strong>${esc(sh||f)}</strong></div></div><div class="panel"><div class="stat-top">ইফতারের বাকি সময়</div><strong id="rmCd" style="font-size:30px">—</strong></div><div class="field"><label>সেহরির শেষ সময় (ফজরের ঠিক আগে, ২৪ ঘণ্টা, যেমন 04:50)</label><input class="input" id="sehri" value="${esc(sh)}" placeholder="${esc(f)}"></div><div class="notice-banner">নামাজ ও রোজার সময় স্থানীয় নির্ভরযোগ্য সময়সূচি দেখে নিজে বসান।</div>`},
log(){return `<div class="toolbar"><h2>পরিবর্তনের লগ</h2></div><div class="notice-banner">এই ডিভাইসে তথ্যের সংখ্যা বদলালে লগ হয় (কে করেছে তা রেকর্ড হয় না)। প্রতি ৭ দিনে একটা ব্যাকআপ কপি এই ডিভাইসে নিজে থেকে রাখা হয়।</div><div class="actions" style="margin-bottom:12px"><button class="btn" data-abdl>${ex.ab?'সর্বশেষ অটো ব্যাকআপ ডাউনলোড ('+new Date(ex.ab_t).toLocaleDateString('bn-BD')+')':'এখনো ব্যাকআপ হয়নি'}</button></div><div class="panel">${ex.log.map(l=>`<div class="tx"><span>${esc(l.m)}</span><small>${esc(l.t)}</small></div>`).join('')||'<div class="empty">লগ খালি</div>'}</div>`}};
const ADD={
chanda:()=>modal('চাঁদাদাতা যোগ',field('নাম','name')+field('মাসিক পরিমাণ','amt','','number'),d=>{ex.chanda.subs.push({id:Date.now(),name:d.name,amt:+d.amt});sv()}),
stu:()=>modal('ছাত্র যোগ',field('নাম','name')+field('মাসিক বেতন','fee','','number'),d=>{ex.mad.st.push({id:Date.now(),name:d.name,fee:+d.fee});sv()}),
min:()=>modal('সভার সিদ্ধান্ত',field('বিষয়','title')+field('তারিখ','date',today(),'date')+'<div class="field full"><label>সিদ্ধান্তসমূহ</label><textarea name="body" required></textarea></div>',d=>{ex.min.push({id:Date.now(),...d});sv()}),
ast:()=>modal('সম্পত্তি/সরঞ্জাম',field('নাম','name')+field('সংখ্যা','qty','','number')+field('অবস্থা','note','ভালো/মেরামত দরকার'),d=>{ex.ast.push({id:Date.now(),...d});sv()})};
const DEL={chanda:id=>ex.chanda.subs=ex.chanda.subs.filter(x=>x.id!=id),stu:id=>ex.mad.st=ex.mad.st.filter(x=>x.id!=id),min:id=>ex.min=ex.min.filter(x=>x.id!=id),ast:id=>ex.ast=ex.ast.filter(x=>x.id!=id)};
const flip=(o,k,id)=>{const a=o[k]||(o[k]=[]),i=a.indexOf(id);i<0?a.push(id):a.splice(i,1)};
const c=$('#content');
c.addEventListener('click',e=>{const t=e.target.closest('[data-add],[data-del],[data-abdl],[data-ed],[data-wa]');if(!t)return;
 if(t.dataset.add)requirePin(ADD[t.dataset.add]);
 else if(t.dataset.del){const[k,id]=t.dataset.del.split(':');requirePin(()=>{if(confirm('মুছবেন?')){DEL[k](+id);sv();render()}})}
 else if('abdl' in t.dataset)download('masjid-auto-backup.json',ex.ab||'{}','application/json');
 else if(t.dataset.ed){const x=txs().find(y=>y.id==t.dataset.ed);if(!x)return;requirePin(()=>{modal('লেনদেন সম্পাদনা',field('পরিমাণ','amount','','number')+field('তারিখ','date','','date')+field('খাত','category'),d=>{const o=db.accounts.find(y=>y.id==x.id)||db.donations.find(y=>y.id==x.id);Object.assign(o,{amount:+d.amount,date:d.date,category:d.category})});const f=$('#modalForm');f.amount.value=x.amount;f.date.value=x.date||'';f.category.value=x.category||''})}
 else if('wa' in t.dataset){const T=txs().filter(x=>(x.date||'').startsWith(yr)),I=sum(T.filter(x=>x.kind==='আয়'),'amount'),O=sum(T.filter(x=>x.kind==='ব্যয়'),'amount');
  open('https://wa.me/?text='+encodeURIComponent(`গোপীনাথপুর জামে মসজিদ — ${yr} সালের হিসাব\nমোট আয়: ${money(I)}\nমোট ব্যয়: ${money(O)}\nউদ্বৃত্ত: ${money(I-O)}`),'_blank','noopener')}});
c.addEventListener('change',e=>{const t=e.target,d=t.dataset;
 if(d.pay){flip(ex.chanda.paid,cm,+d.pay);sv();render()}else if(d.att){flip(ex.mad.att,md,+d.att);sv();render()}
 else if(d.bl){ex.budget[d.bl]=+t.value;sv();render()}else if(t.id==='cm'){cm=t.value;render()}else if(t.id==='md'){md=t.value;render()}else if(t.id==='sehri'){ex.sehri=t.value;sv();render()}});
setInterval(()=>{const el=$('#rmCd');if(!el)return;const[h,m]=String(db.prayer['মাগরিব']).split(':').map(Number),d=new Date();d.setHours(h,m,0,0);let s=Math.floor((d-new Date())/1e3);el.textContent=s<=0?'ইফতারের সময় হয়েছে':bn(s/3600|0)+':'+bn(s%3600/60|0).padStart(2,'০')+':'+bn(s%60).padStart(2,'০')},1000);
/* রেন্ডার */
const _r=render;render=function(){if(P[page]){$('#pageTitle').textContent=PAGES[page][0];$('#content').innerHTML=P[page]();window._dress&&_dress();return post()}_r();post()};
function post(){if(page!=='accounts')return;
 $$('[data-txd]').forEach(b=>{if(!b.parentNode.querySelector('[data-ed]'))b.insertAdjacentHTML('beforebegin',`<button data-ed="${b.dataset.txd}" title="সম্পাদনা">✏</button>`)});
 const p=$('#prt1');if(p&&!$('[data-wa]'))p.insertAdjacentHTML('afterend',' <button class="btn secondary small" data-wa>WhatsApp</button>')}
/* লগ ও অটো ব্যাকআপ */
const K=['notices','donations','accounts','members','events','gallery'],KN={notices:'ঘোষণা',donations:'অনুদান',accounts:'লেনদেন',members:'সদস্য',events:'ইভেন্ট',gallery:'ছবি'},snap=()=>K.map(k=>(db[k]||[]).length);let prev=null;
setTimeout(()=>{prev=snap();if(!ex.ab_t||Date.now()-ex.ab_t>6048e5){ex.ab=JSON.stringify({db,extra:{chanda:ex.chanda,budget:ex.budget,mad:ex.mad,min:ex.min,ast:ex.ast}});ex.ab_t=Date.now();sv()}},6000);
setInterval(()=>{if(!prev)return;const n=snap();K.forEach((k,i)=>{if(n[i]!==prev[i])ex.log.unshift({t:new Date().toLocaleString('bn-BD'),m:(n[i]>prev[i]?'যোগ: ':'মুছা: ')+KN[k]+' ('+bn(Math.abs(n[i]-prev[i]))+'টি)'})});if(n.join()!==prev.join()){prev=n;ex.log=ex.log.slice(0,100);sv()}},2000);
render()})();
