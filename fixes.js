/* গোপীনাথপুর মসজিদ — ফিক্স: ব্যাক/মেনু, ১ পেজ প্রিন্ট, সহজ হিসাব লেখা */
(function(){
const sb=$('#sidebar'),mb=$('#modalBackdrop'),bn=n=>Number(n||0).toLocaleString('bn-BD');
const isOpen=()=>sb.classList.contains('open')||mb.classList.contains('show');
let popping=false;
/* --- মেনু/মডাল: ✕ বাটন, বাইরে চাপলে বন্ধ, ফোনের ব্যাক --- */
sb.insertAdjacentHTML('afterbegin','<button class="side-x" id="sideX" aria-label="বন্ধ">✕ বন্ধ করুন</button>');
const closeDom=()=>{sb.classList.remove('open');mb.classList.remove('show')};
const closeAll=()=>history.state&&history.state.ov?history.back():closeDom();
$('#sideX').onclick=closeAll;
document.addEventListener('click',e=>{
 if(e.target.closest('#menuBtn')||e.target.closest('#dock button:not([data-page])')){e.stopImmediatePropagation();e.preventDefault();sb.classList.contains('open')?closeAll():sb.classList.add('open');return}
 if(sb.classList.contains('open')&&!e.target.closest('#sidebar'))closeAll();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen())closeAll()});
$('#closeModal').onclick=closeAll;mb.onclick=e=>{if(e.target===mb)closeAll()};
new MutationObserver(()=>{
 if(isOpen()&&!(history.state&&history.state.ov))history.pushState({ov:1},'');
 else if(!isOpen()&&history.state&&history.state.ov&&!popping)history.back();
}).observe(sb,{attributes:true,attributeFilter:['class']});
new MutationObserver(()=>{
 if(isOpen()&&!(history.state&&history.state.ov))history.pushState({ov:1},'');
 else if(!isOpen()&&history.state&&history.state.ov&&!popping)history.back();
}).observe(mb,{attributes:true,attributeFilter:['class']});
/* --- পেজ বদলালেও ব্যাক কাজ করবে --- */
const _sp=setPage;
setPage=function(p,fromPop){
 if(!fromPop&&p!==page){const s={pg:p};history.state&&history.state.ov?history.replaceState(s,''):history.pushState(s,'')}
 _sp(p)};
addEventListener('popstate',e=>{
 popping=true;
 if(isOpen()){closeDom()}
 else{const p=(e.state&&e.state.pg)||'home';if(p!==page)setPage(p,true)}
 setTimeout(()=>popping=false,0)});
history.replaceState({pg:'home'},'');
/* --- ফর্ম সহজ: অপশনাল ঘরে required থাকবে না --- */
const OPT=['receiptNo','approvedBy','sourceFund','recipient','note','phone','bank','bkash','nagad'];
new MutationObserver(()=>{
 OPT.forEach(n=>$$('#modalBody [name="'+n+'"]').forEach(i=>i.required=false));
 const k=window._kind,s=$('#modalBody select[name="kind"]');if(k&&s){s.value=k;window._kind=null}
}).observe($('#modalBody'),{childList:true});
/* --- ১ পেজে প্রিন্ট --- */
const txs=()=>[...db.donations.map(x=>({...x,kind:'আয়'})),...db.accounts];
function sheet(y,m){
 const L=txs().filter(x=>(x.date||'').startsWith(y+(m==='all'?'':'-'+m))),S=(k,a=L)=>a.filter(x=>x.kind===k).reduce((s,x)=>s+Number(x.amount||0),0);
 const inc=S('আয়'),out=S('ব্যয়'),mn=m==='all'?'পুরো বছর':new Date(2000,+m-1,1).toLocaleDateString('bn-BD',{month:'long'});
 const cat=k=>{const o={};L.filter(x=>x.kind===k).forEach(x=>o[x.category||'অন্যান্য']=(o[x.category||'অন্যান্য']||0)+Number(x.amount||0));
  const r=Object.entries(o).sort((a,b)=>b[1]-a[1]);return '<table><tr><th>খাত</th><th>টাকা</th></tr>'+(r.map(c=>`<tr><td>${esc(c[0])}</td><td class="r">${money(c[1])}</td></tr>`).join('')||'<tr><td colspan=2>—</td></tr>')+'</table>'};
 let low='';
 if(m==='all'){low='<h4>মাসভিত্তিক সারসংক্ষেপ</h4><table><tr><th>মাস</th><th>আয়</th><th>ব্যয়</th><th>উদ্বৃত্ত</th></tr>'+Array.from({length:12},(_,i)=>{const mm=String(i+1).padStart(2,'0'),a=L.filter(x=>(x.date||'').slice(5,7)===mm),I=S('আয়',a),O=S('ব্যয়',a);return `<tr><td>${new Date(2000,i,1).toLocaleDateString('bn-BD',{month:'long'})}</td><td class="r">${money(I)}</td><td class="r">${money(O)}</td><td class="r">${money(I-O)}</td></tr>`}).join('')+'</table>'}
 else{low='<h4>লেনদেনের তালিকা</h4><table><tr><th>তারিখ</th><th>ধরন</th><th>খাত</th><th>বিবরণ</th><th>টাকা</th></tr>'+L.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(x=>`<tr><td>${esc(x.date||'')}</td><td>${esc(x.kind)}</td><td>${esc(x.category||'')}</td><td>${esc(x.note||x.name||'')}</td><td class="r">${money(x.amount)}</td></tr>`).join('')+'</table>'}
 return `<div class="ps-in"><div class="ps-h"><b>গোপীনাথপুর জামে মসজিদ</b><span>আয়-ব্যয়ের হিসাব · ${y} · ${mn}</span></div>
 <div class="ps-sum"><div>মোট আয়<b>${money(inc)}</b></div><div>মোট ব্যয়<b>${money(out)}</b></div><div>উদ্বৃত্ত<b>${money(inc-out)}</b></div></div>
 <div class="ps-two"><div><h4>আয়ের খাত</h4>${cat('আয়')}</div><div><h4>ব্যয়ের খাত</h4>${cat('ব্যয়')}</div></div>${low}
 <div class="ps-sig"><span>কোষাধ্যক্ষ</span><span>সাধারণ সম্পাদক</span><span>সভাপতি</span></div><small>ছাপার তারিখ: ${dateBn()}</small></div>`}
function printOne(){
 const y=($('#reportYear')||{}).value||new Date().getFullYear(),m=($('#reportMonth')||{}).value||'all';
 let el=$('#printSheet');if(!el){el=document.createElement('div');el.id='printSheet';document.body.appendChild(el)}
 el.innerHTML=sheet(y,m);document.body.classList.add('printing');
 const inn=el.firstElementChild,H=277*3.7795;inn.style.zoom=1;
 const k=Math.min(1,H/inn.scrollHeight);inn.style.zoom=Math.max(.5,k);
 if(k<.5)toast('লেনদেন অনেক বেশি — মাস বেছে নিয়ে প্রিন্ট করুন');
 setTimeout(()=>print(),150)}
addEventListener('afterprint',()=>document.body.classList.remove('printing'));
/* --- হিসাব পেজ: বড় আয়/ব্যয় বাটন, সহজ তালিকা, প্রিন্ট বাটন --- */
function enhance(){
 if(page!=='accounts'||$('.quick'))return;const st=$('#content .stats');if(!st)return;
 const L=txs().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,10);
 st.insertAdjacentHTML('afterend',`<div class="quick"><button class="q in" data-q="আয়">＋ আয় লিখুন</button><button class="q out" data-q="ব্যয়">− ব্যয় লিখুন</button></div>
 <div class="panel"><div class="section-head"><h3>সর্বশেষ লেনদেন</h3><button class="btn secondary small" id="prt1">🖨 ১ পেজে প্রিন্ট</button></div>${L.map(x=>`<div class="tx"><div><b>${esc(x.category||'অন্যান্য')}</b><small>${esc(x.date||'')} · ${esc(x.note||x.name||'')}</small></div><span class="amt ${x.kind==='আয়'?'in':'out'}">${x.kind==='আয়'?'+':'−'} ${money(x.amount)}</span><span class="txb">${x.kind==='আয়'?`<button data-rc="${x.id}" title="রসিদ">🧾</button>`:''}<button data-txd="${x.id}" title="মুছুন">🗑</button></span></div>`).join('')||'<div class="empty">এখনো কোনো লেনদেন নেই</div>'}</div>`);
 $$('.quick .q').forEach(b=>b.onclick=()=>{window._kind=b.dataset.q;action('addAccount')});
 $('#prt1').onclick=printOne;
 $$('[data-txd]').forEach(b=>b.onclick=()=>requirePin(()=>{if(!confirm('এই লেনদেনটি মুছবেন?'))return;const id=b.dataset.txd;db.accounts=db.accounts.filter(y=>y.id!=id);db.donations=db.donations.filter(y=>y.id!=id);save();render();toast('মুছে ফেলা হয়েছে')}));
 $$('[data-rc]').forEach(b=>b.onclick=()=>{const x=txs().find(y=>y.id==b.dataset.rc);if(x)receipt(x)})}
function receipt(x){let el=$('#printSheet');if(!el){el=document.createElement('div');el.id='printSheet';document.body.appendChild(el)}
 el.innerHTML=`<div class="ps-in" style="zoom:1"><div class="ps-h"><b>গোপীনাথপুর জামে মসজিদ</b><span>দানের রসিদ</span></div><table><tr><td>রসিদ নং</td><td>${esc(x.receiptNo||x.id)}</td></tr><tr><td>তারিখ</td><td>${esc(x.date||'')}</td></tr><tr><td>দাতা</td><td>${esc(x.name||x.recipient||'—')}</td></tr><tr><td>খাত</td><td>${esc(x.category||'')}</td></tr><tr><td>টাকা</td><td><b>${money(x.amount)}</b></td></tr></table><div class="ps-sig"><span>গ্রহণকারী</span><span>কোষাধ্যক্ষ</span></div><small>জাযাকাল্লাহু খাইরান — আল্লাহ কবুল করুন</small></div>`;
 document.body.classList.add('printing');setTimeout(()=>print(),150)}
const _r=render;render=function(){_r();enhance()};render();
})();
