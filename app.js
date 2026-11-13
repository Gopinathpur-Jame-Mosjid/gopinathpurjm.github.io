/* গোপীনাথপুর জামে মসজিদ — সব লজিক এক ফাইলে (app + premium + cloud + fixes + features + extras + হোম/থিম/AI) */

/* ===== app.js ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='gopinathpur_masjid_v1';
const defaults={
 prayer:{ফজর:'05:00',যোহর:'12:15',আসর:'16:15',মাগরিব:'17:30',এশা:'19:00',জুমা:'13:15',ইকামত:{ফজর:'05:20',যোহর:'12:30',আসর:'16:30',মাগরিব:'17:35',এশা:'19:15'}},
 notices:[{id:1,title:'গোপীনাথপুর জামে মসজিদে স্বাগতম',body:'মসজিদের সকল আপডেট ও গুরুত্বপূর্ণ ঘোষণা এখানে প্রকাশ করা হবে।',date:new Date().toISOString().slice(0,10),type:'সাধারণ'}],
 donations:[],accounts:[],members:[{id:1,name:'মসজিদ কমিটি',role:'পরিচালনা কমিটি',phone:'',note:'তথ্য অ্যাডমিন থেকে সম্পাদনা করুন'}],
 events:[],gallery:[],settings:{goal:100000,adminPin:'1234',bkash:'',nagad:'',bank:''}
};
let db=load(),page='home';
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function money(n){return '৳ '+Number(n||0).toLocaleString('en-IN')}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dateBn(d=new Date()){return new Intl.DateTimeFormat('bn-BD',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d)}
function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2300)}
function sum(arr,key){return arr.reduce((a,x)=>a+Number(x[key]||0),0)}
function setPage(p){page=p;$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===p));$('#sidebar').classList.remove('open');render()}
function pageTitle(p){return ({home:'ড্যাশবোর্ড',prayer:'নামাজের সময়সূচি',notices:'ঘোষণা ও নোটিশ',donations:'দান ও অনুদান',accounts:'আয়-ব্যয়ের হিসাব',committee:'কমিটি ও পরিচিতি',library:'ইসলামিক লাইব্রেরি',community:'কমিউনিটি ও সেবা',events:'ইভেন্ট ও মাহফিল',gallery:'ছবি ও ভিডিও',admin:'অ্যাডমিন প্যানেল'})[p]}
function render(){ $('#pageTitle').textContent=pageTitle(page);$('#dateLine').textContent=dateBn();$('#content').innerHTML=({home:home,prayer:prayer,notices:notices,donations:donations,accounts:accounts,committee:committee,library:library,community:community,events:events,gallery:gallery,admin:admin}[page])();wirePage(); }
function home(){
 const inc=sum(db.accounts.filter(x=>x.kind==='আয়'),'amount'),out=sum(db.accounts.filter(x=>x.kind==='ব্যয়'),'amount'),don=sum(db.donations,'amount'),spent=sum(db.accounts.filter(x=>x.kind==='ব্যয়'),'amount'),pct=Math.min(100,db.settings.goal?don/db.settings.goal*100:0);
 let prayers=Object.entries(db.prayer).filter(([k,v])=>typeof v==='string');
 return `<section class="hero"><div><div class="kicker">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · BISMILLAH</div><h2>গোপীনাথপুর জামে মসজিদ</h2><p>ইবাদত, ঐক্য ও মানবসেবার ডিজিটাল ঠিকানা</p></div><div class="hero-date"><strong>${new Intl.DateTimeFormat('bn-BD',{day:'numeric',month:'short'}).format(new Date())}</strong><span>${dateBn()}</span></div></section>
 <div class="grid stats"><div class="stat"><div class="stat-top">মোট অনুদান <span class="stat-icon">♡</span></div><strong>${money(don)}</strong><small>নিবন্ধিত অনুদান</small></div><div class="stat"><div class="stat-top">মোট আয় <span class="stat-icon">↗</span></div><strong>${money(inc+don)}</strong><small>অনুদানসহ</small></div><div class="stat"><div class="stat-top">মোট ব্যয় <span class="stat-icon">↘</span></div><strong>${money(out)}</strong><small>নিবন্ধিত ব্যয়</small></div><div class="stat"><div class="stat-top">নোটিশ <span class="stat-icon">▤</span></div><strong>${db.notices.length}</strong><small>প্রকাশিত ঘোষণা</small></div></div>
 <div class="section-head"><h3>নামাজের সময়সূচি</h3><button class="btn secondary small" data-go="prayer">সম্পূর্ণ সময়সূচি →</button></div><div class="grid prayers">${prayers.slice(0,5).map(([n,t],i)=>`<div class="prayer-card ${i===2?'next':''}"><span>${n}</span><b>${esc(t)}</b><em>${i===2?'পরবর্তী (ডেমো)':'নামাজের সময়'}</em></div>`).join('')}</div>
 <div class="section-head"><h3>দ্রুত সেবা</h3><small>প্রয়োজনীয় সবকিছু এক জায়গায়</small></div><div class="grid tile-grid">${[['prayer','◷','নামাজের সময়','দৈনিক সময়সূচি'],['donations','♡','অনুদান','দান নিবন্ধন'],['notices','▤','ঘোষণা','সর্বশেষ নোটিশ'],['library','▣','ইসলামিক লাইব্রেরি','দোয়া ও শিক্ষা'],['accounts','৳','হিসাব','আয়-ব্যয় রিপোর্ট'],['events','▦','ইভেন্ট','মাহফিল ও অনুষ্ঠান'],['community','♧','কমিউনিটি','জরুরি সেবা'],['committee','♙','পরিচিতি','কমিটি ও যোগাযোগ']].map(a=>`<div class="tile" data-go="${a[0]}"><div class="tile-icon">${a[1]}</div><div><b>${a[2]}</b><small>${a[3]}</small></div></div>`).join('')}</div>
 <div class="grid two-col"><div><div class="section-head"><h3>সর্বশেষ ঘোষণা</h3><button class="btn secondary small" data-go="notices">সব দেখুন</button></div><div class="panel">${db.notices.slice().reverse().slice(0,3).map(n=>`<div class="notice"><div class="notice-icon">▤</div><div><b>${esc(n.title)}</b><p>${esc(n.body)}</p><span class="tag">${esc(n.type)} · ${esc(n.date)}</span></div></div>`).join('')||'<div class="empty">এখনো কোনো ঘোষণা নেই</div>'}</div></div>
 <div><div class="section-head"><h3>অনুদানের অগ্রগতি</h3><button class="btn secondary small" data-go="donations">বিস্তারিত</button></div><div class="panel"><div class="stat-top">লক্ষ্যমাত্রা <b>${money(db.settings.goal)}</b></div><strong style="font:800 25px Manrope;color:var(--green);display:block;margin:12px 0">${money(don)}</strong><div class="progress"><span style="width:${pct}%"></span></div><p class="subtle">${pct.toFixed(1)}% সম্পন্ন · অনুদানের হিসাব অ্যাডমিন আপডেট করেন</p></div></div></div>`;
}
function prayer(){let names=['ফজর','যোহর','আসর','মাগরিব','এশা'];return `<div class="notice-banner">নামাজের সময়গুলো অ্যাডমিন কর্তৃক নির্ধারিত নমুনা সময়। স্থানীয় নির্ভরযোগ্য সময়সূচি অনুযায়ী যাচাই করে নিন।</div><div class="toolbar"><h2>দৈনিক নামাজের সময়</h2><button class="btn" data-action="editPrayer">সময় সম্পাদনা</button></div><div class="grid page-grid">${names.map((n,i)=>`<div class="page-card"><div class="stat-top">${n}<span class="stat-icon">◷</span></div><strong style="font:800 27px Manrope;color:var(--green)">${esc(db.prayer[n])}</strong><p>দৈনিক ওয়াক্ত</p></div>`).join('')}<div class="page-card"><h3>জুমার নামাজ</h3><strong style="font:800 27px Manrope;color:var(--green)">${esc(db.prayer.জুমা)}</strong><p>শুক্রবারের জামাতের সময়</p></div></div><div class="section-head"><h3>নামাজ সম্পর্কিত সুবিধা</h3></div><div class="panel"><div class="settings-row"><span>পরবর্তী নামাজের কাউন্টডাউন</span><span class="tag">সময় কনফিগার করলে সক্রিয় হবে</span></div><div class="settings-row"><span>আজান নোটিফিকেশন</span><span class="tag">ব্রাউজার অনুমতি প্রয়োজন</span></div><div class="settings-row"><span>মাসিক নামাজ ক্যালেন্ডার</span><button class="btn secondary small" data-action="calendar">ক্যালেন্ডার দেখুন</button></div><div class="settings-row"><span>রমজান সেহরি ও ইফতার</span><span class="muted">রমজান মৌসুমে আপডেটযোগ্য</span></div></div>`}
function notices(){return `<div class="toolbar"><h2>সকল ঘোষণা (${db.notices.length})</h2><button class="btn" data-action="addNotice">＋ নতুন ঘোষণা</button></div>${db.notices.slice().reverse().map(n=>`<div class="panel" style="margin-bottom:11px"><div class="stat-top"><span class="tag">${esc(n.type)}</span><small>${esc(n.date)}</small></div><h3>${esc(n.title)}</h3><p class="muted" style="font-size:13px">${esc(n.body)}</p><div class="actions"><button class="btn danger small" data-delete="notice:${n.id}">মুছুন</button></div></div>`).join('')||'<div class="panel empty">কোনো ঘোষণা প্রকাশ করা হয়নি।</div>'}`}
function donations(){let total=sum(db.donations,'amount');return `<div class="grid stats"><div class="stat"><div class="stat-top">মোট অনুদান</div><strong>${money(total)}</strong><small>${db.donations.length}টি এন্ট্রি</small></div><div class="stat"><div class="stat-top">লক্ষ্যমাত্রা</div><strong>${money(db.settings.goal)}</strong><small>অ্যাডমিন নির্ধারিত</small></div></div><div class="toolbar" style="margin-top:23px"><h2>অনুদানের তালিকা</h2><button class="btn" data-action="addDonation">＋ অনুদান যোগ করুন</button></div><div class="notice-banner">স্বচ্ছতার জন্য অনুদানের তথ্য অনুমতি নিয়ে প্রকাশ করুন। অনলাইন পেমেন্ট এখনো যুক্ত নয়; পেমেন্ট নম্বর অ্যাডমিন সেটিংসে যোগ করতে হবে।</div>${table(['তারিখ','দাতার নাম','খাত','পরিমাণ','মাধ্যম'],db.donations.map(x=>[x.date,x.name,x.category,money(x.amount),x.method]))}`}
function accounts(){
 const allTx=[...db.donations.map(x=>({...x,kind:'আয়',note:'অনুদান · '+(x.name||'নাম উল্লেখ নেই'),sourceFund:x.category,recipient:'—',approvedBy:x.approvedBy||'—',receiptNo:x.receiptNo||'—'})),...db.accounts];
 let inc=sum(allTx.filter(x=>x.kind==='আয়'),'amount'),out=sum(allTx.filter(x=>x.kind==='ব্যয়'),'amount'),balance=inc-out;
 let cats={};allTx.forEach(x=>{let k=(x.kind==='আয়'?'আয় · ':'ব্যয় · ')+(x.category||'অন্যান্য');cats[k]=(cats[k]||0)+Number(x.amount||0)});
 let categoryRows=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
 let years=[...new Set([new Date().getFullYear(),...allTx.map(x=>Number((x.date||'').slice(0,4))).filter(Boolean)])].sort((a,b)=>b-a);
 let currentYear=new Date().getFullYear();
 let weekly=allTx.filter(x=>x.kind==='আয়'&&/জুমা|শুক্রবার/i.test(x.category||'')).reduce((a,x)=>{let k=x.date||'তারিখ নেই';a[k]=(a[k]||0)+Number(x.amount||0);return a},{});
 let weeklyRows=Object.entries(weekly).sort((a,b)=>b[0].localeCompare(a[0]));
 let tx=allTx.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 return `<div class="grid stats"><div class="stat"><div class="stat-top">মোট আয়</div><strong>${money(inc)}</strong><small>সব আয়ের উৎস</small></div><div class="stat"><div class="stat-top">মোট ব্যয়</div><strong>${money(out)}</strong><small>সব ব্যয়ের খাত</small></div><div class="stat"><div class="stat-top">বর্তমান উদ্বৃত্ত</div><strong>${money(balance)}</strong><small>আয় − ব্যয়</small></div><div class="stat"><div class="stat-top">লেনদেন</div><strong>${tx.length}</strong><small>মোট রেকর্ড</small></div></div>
 <div class="toolbar" style="margin-top:22px"><h2>আয়-ব্যয়ের খাতা</h2><div class="actions"><button class="btn secondary" data-action="exportCsv">CSV রিপোর্ট</button><button class="btn" data-action="addAccount">＋ নতুন লেনদেন</button></div></div>
 <div class="notice-banner">জুমার কালেকশন যোগ করার সময় অনুদানের খাত হিসেবে “জুমার দান” নির্বাচন করুন। তারিখটি শুক্রবারের দিন দিন।</div>
 <div class="panel" style="margin-top:16px"><div class="section-head"><h3>মাসিক ও বছরভিত্তিক রিপোর্ট</h3><span class="tag">স্বয়ংক্রিয় হিসাব</span></div>
 <div class="form-grid"><div class="field"><label>রিপোর্টের বছর</label><select id="reportYear">${years.map(y=>`<option value="${y}" ${y===currentYear?'selected':''}>${y}</option>`).join('')}</select></div><div class="field"><label>মাস নির্বাচন</label><select id="reportMonth"><option value="all">পুরো বছর</option>${Array.from({length:12},(_,i)=>`<option value="${String(i+1).padStart(2,'0')}">${new Date(2000,i,1).toLocaleDateString('bn-BD',{month:'long'})}</option>`).join('')}</select></div></div>
 <div id="periodReport" style="margin-top:16px"></div></div>
 <div class="panel" style="margin-top:16px"><div class="section-head"><h3>শুক্রবারের জুমা কালেকশন</h3><small>তারিখ অনুযায়ী মোট সংগ্রহ</small></div>
 ${table(['শুক্রবারের তারিখ','মোট কালেকশন'],weeklyRows.map(x=>[x[0],money(x[1])]))}
 <small class="muted">এই তালিকায় “জুমার দান” খাতে যোগ করা আয় দেখানো হবে।</small></div>
 <div class="section-head"><h3>খাতভিত্তিক সারসংক্ষেপ</h3><small>মোট টাকা</small></div>
 ${table(['আয়/ব্যয়ের খাত','মোট পরিমাণ'],categoryRows.map(x=>[x[0],money(x[1])]))}
 <div class="section-head"><h3>সকল লেনদেনের বিস্তারিত</h3><small>তারিখ অনুযায়ী</small></div>
 <div class="table-wrap"><table class="data-table"><thead><tr><th>তারিখ</th><th>ধরন</th><th>খাত</th><th>বিবরণ</th><th>উৎস ফান্ড</th><th>গ্রহণকারী/দাতা</th><th>পরিমাণ</th><th>রসিদ</th></tr></thead><tbody>${tx.length?tx.map(x=>`<tr><td>${esc(x.date||'')}</td><td><span class="tag">${esc(x.kind)}</span></td><td>${esc(x.category||'')}</td><td>${esc(x.note||'')}</td><td>${esc(x.sourceFund||'—')}</td><td>${esc(x.kind==='আয়'?(x.name||'—'):(x.recipient||'—'))}</td><td class="amount">${money(x.amount)}</td><td>${esc(x.receiptNo||'—')}</td></tr>`).join(''):`<tr><td colspan="8" class="empty">এখনো কোনো লেনদেন যোগ করা হয়নি</td></tr>`}</tbody></table></div>
 <div class="section-head"><h3>হিসাবের নিয়ম</h3></div><div class="panel"><div class="settings-row"><span>প্রতিটি খরচের জন্য রসিদ/প্রমাণ সংযুক্ত করুন</span><span class="tag">প্রস্তাবিত</span></div><div class="settings-row"><span>নির্দিষ্ট ফান্ডের টাকা অন্য খাতে ব্যবহার করলে কারণ লিখুন</span><span class="tag">প্রস্তাবিত</span></div><div class="settings-row"><span>মাস শেষে ক্যাশ/ব্যাংক ব্যালেন্স মিলিয়ে নিন</span><span class="tag">প্রস্তাবিত</span></div></div>`;
}
function updatePeriodReport(){
 const box=$('#periodReport'),ys=$('#reportYear'),ms=$('#reportMonth');if(!box||!ys||!ms)return;
 const year=ys.value,month=ms.value;
 const all=[...db.donations.map(x=>({...x,kind:'আয়'})),...db.accounts].filter(x=>(x.date||'').startsWith(year+(month==='all'?'':'-'+month)));
 const inc=sum(all.filter(x=>x.kind==='আয়'),'amount'),out=sum(all.filter(x=>x.kind==='ব্যয়'),'amount');
 const rows=month==='all'?Array.from({length:12},(_,i)=>{let m=String(i+1).padStart(2,'0'),items=all.filter(x=>(x.date||'').slice(5,7)===m);return [new Date(Number(year),i,1).toLocaleDateString('bn-BD',{month:'long'}),money(sum(items.filter(x=>x.kind==='আয়'),'amount')),money(sum(items.filter(x=>x.kind==='ব্যয়'),'amount')),money(sum(items.filter(x=>x.kind==='আয়'),'amount')-sum(items.filter(x=>x.kind==='ব্যয়'),'amount'))]}):[];
 box.innerHTML=`<div class="grid stats"><div class="stat"><div class="stat-top">${month==='all'?'বছরের মোট আয়':'মাসের মোট আয়'}</div><strong>${money(inc)}</strong></div><div class="stat"><div class="stat-top">${month==='all'?'বছরের মোট ব্যয়':'মাসের মোট ব্যয়'}</div><strong>${money(out)}</strong></div><div class="stat"><div class="stat-top">অবশিষ্ট</div><strong>${money(inc-out)}</strong></div></div>`+(month==='all'?table(['মাস','আয়','ব্যয়','উদ্বৃত্ত'],rows):`<div class="notice-banner">${year} সালের ${new Date(Number(year),Number(month)-1,1).toLocaleDateString('bn-BD',{month:'long'})} মাসের মোট ${all.length}টি লেনদেন।</div>`+table(['তারিখ','ধরন','খাত','বিবরণ','পরিমাণ'],all.sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(x=>[x.date,x.kind,x.category||'—',x.note||x.name||'—',money(x.amount)])));
}

function table(headers,rows){return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}" class="empty">এখনো কোনো তথ্য যোগ করা হয়নি</td></tr>`}</tbody></table></div>`}
function committee(){return `<div class="toolbar"><h2>মসজিদ পরিচালনা কমিটি</h2><button class="btn" data-action="addMember">＋ সদস্য যোগ</button></div><div class="grid page-grid">${db.members.map(m=>`<div class="page-card"><div class="member"><div class="avatar">${esc((m.name||'?').slice(0,1))}</div><div><b>${esc(m.name)}</b><div class="subtle">${esc(m.role)}</div></div></div><p>${esc(m.note||'')}</p><div class="subtle">যোগাযোগ: ${esc(m.phone||'তথ্য দেওয়া হয়নি')}</div><div class="actions" style="margin-top:12px"><button class="btn danger small" data-delete="member:${m.id}">মুছুন</button></div></div>`).join('')}</div><div class="notice-banner" style="margin-top:15px">ইমাম, মুয়াজ্জিন, সভাপতি, সাধারণ সম্পাদক ও কোষাধ্যক্ষের সঠিক তথ্য অ্যাডমিন থেকে যোগ করুন।</div>`}
function library(){let items=[['কুরআন মাজিদ','আরবি তিলাওয়াত ও বাংলা অনুবাদ','📖'],['হাদিস','নির্ভরযোগ্য হাদিস পাঠ','📚'],['দৈনন্দিন দোয়া','সকাল-সন্ধ্যা ও প্রয়োজনীয় দোয়া','🤲'],['নামাজ শিক্ষা','ওজু, নামাজ ও প্রয়োজনীয় মাসআলা','🕌'],['ডিজিটাল তাসবিহ','তাসবিহ গণনার সহজ কাউন্টার','📿'],['ইসলামিক প্রবন্ধ','জ্ঞান ও সচেতনতামূলক লেখা','✦']];return `<div class="notice-banner">ধর্মীয় বিষয়বস্তু প্রকাশের আগে নির্ভরযোগ্য আলেম/উৎস দিয়ে যাচাই করুন। এই সংস্করণে লাইব্রেরির বিভাগগুলো প্রস্তুত রাখা হয়েছে।</div><div class="grid page-grid">${items.map((x,i)=>`<div class="page-card library-card"><div class="book-icon">${x[2]}</div><div><h3>${x[0]}</h3><p>${x[1]}</p><button class="btn secondary small" data-library="${i}">${i===4?'তাসবিহ খুলুন':'বিভাগ দেখুন'}</button></div></div>`).join('')}</div>`}
function community(){return `<div class="grid page-grid"><div class="page-card"><div class="tile-icon">🩸</div><h3>স্বেচ্ছায় রক্তদাতা তালিকা</h3><p>রক্তদাতা নিজে সম্মতি দিয়ে নাম, গ্রুপ ও যোগাযোগের তথ্য দিতে পারবেন। তথ্য প্রকাশের আগে সম্মতি নিশ্চিত করুন।</p><button class="btn" data-action="addBlood">রক্তদাতা নিবন্ধন</button></div><div class="page-card"><div class="tile-icon">☎</div><h3>জরুরি যোগাযোগ</h3><p>মসজিদ কমিটি, স্থানীয় হাসপাতাল ও জরুরি সেবার যাচাইকৃত নম্বর সংরক্ষণ করুন।</p><button class="btn secondary" data-action="emergency">যোগাযোগ যোগ করুন</button></div><div class="page-card"><div class="tile-icon">🤝</div><h3>অসহায়দের সহায়তা</h3><p>স্বেচ্ছাসেবী কার্যক্রম ও সহায়তা বিতরণের তথ্য প্রকাশ করুন।</p><button class="btn secondary" data-go="events">কার্যক্রম দেখুন</button></div><div class="page-card"><div class="tile-icon">⚰</div><h3>জানাজা ও দাফন সংক্রান্ত ঘোষণা</h3><p>পরিবারের অনুমতি নিয়ে জানাজার সময় ও স্থান প্রকাশ করুন।</p><button class="btn secondary" data-action="addNotice">জরুরি ঘোষণা দিন</button></div></div>`}
function events(){return `<div class="toolbar"><h2>অনুষ্ঠান ও ইভেন্ট</h2><button class="btn" data-action="addEvent">＋ ইভেন্ট যোগ</button></div><div class="panel">${db.events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`<div class="event-row"><div class="event-date"><b>${esc((e.date||'').slice(8,10))}</b>${esc((e.date||'').slice(5,7))}</div><div style="flex:1"><b>${esc(e.title)}</b><div class="subtle">${esc(e.time)} · ${esc(e.place)}</div><p class="subtle">${esc(e.note||'')}</p></div><button class="btn danger small" data-delete="event:${e.id}">মুছুন</button></div>`).join('')||'<div class="empty">এখনো কোনো ইভেন্ট যোগ করা হয়নি</div>'}</div>`}
function gallery(){return `<div class="toolbar"><h2>মসজিদের ছবি ও ভিডিও গ্যালারি</h2><button class="btn" data-action="addGallery">＋ ছবি যোগ</button></div><div class="notice-banner">ছবি এই ডিভাইসের ব্রাউজারে সংরক্ষিত হয়। বড় ছবি যোগ করলে স্টোরেজ সীমা পূর্ণ হতে পারে।</div><div class="grid gallery-grid">${db.gallery.map(g=>`<div class="page-card"><img src="${g.data}" alt="${esc(g.title)}" style="width:100%;height:145px;object-fit:cover;border-radius:12px"><b>${esc(g.title)}</b><div class="actions"><button class="btn danger small" data-delete="gallery:${g.id}">মুছুন</button></div></div>`).join('')||'<div class="page-card gallery-box">🕌<p>মসজিদের ছবি এখানে দেখা যাবে</p></div>'}</div>`}
function admin(){return `<div class="notice-banner">অ্যাডমিন প্যানেলটি ডেমো PIN 1234 দিয়ে সুরক্ষিত। প্রথম ব্যবহারে PIN পরিবর্তন করুন। প্রকৃত অনলাইন বহু-ডিভাইস ব্যবহারের জন্য Firebase/সার্ভার সংযোগ ও ভূমিকা-ভিত্তিক নিরাপত্তা সেটআপ করতে হবে।</div><div class="grid page-grid"><div class="page-card"><h3>🕌 নামাজের সময়</h3><p>দৈনিক নামাজের সময় হালনাগাদ করুন।</p><button class="btn" data-action="editPrayer">সময় সম্পাদনা</button></div><div class="page-card"><h3>📢 ঘোষণা ব্যবস্থাপনা</h3><p>নতুন নোটিশ প্রকাশ করুন।</p><button class="btn" data-action="addNotice">ঘোষণা প্রকাশ</button></div><div class="page-card"><h3>💰 অনুদানের লক্ষ্যমাত্রা</h3><p>ফান্ডের লক্ষ্য নির্ধারণ করুন।</p><button class="btn" data-action="goal">লক্ষ্যমাত্রা সেট</button></div><div class="page-card"><h3>📲 পেমেন্ট তথ্য</h3><p>বিকাশ, নগদ ও ব্যাংকের তথ্য যোগ করুন।</p><button class="btn" data-action="payment">তথ্য সম্পাদনা</button></div><div class="page-card"><h3>🔐 অ্যাডমিন PIN</h3><p>ডেমো PIN পরিবর্তন করুন।</p><button class="btn" data-action="pin">PIN পরিবর্তন</button></div><div class="page-card"><h3>📄 ডেটা ব্যাকআপ</h3><p>সব তথ্য JSON ফাইলে সংরক্ষণ বা পুনরুদ্ধার করুন।</p><div class="actions"><button class="btn secondary" data-action="backup">ব্যাকআপ</button><button class="btn secondary" data-action="restore">রিস্টোর</button></div></div></div><div class="panel" style="margin-top:15px"><h3>গুরুত্বপূর্ণ সীমাবদ্ধতা</h3><p class="muted" style="font-size:12px">এই সংস্করণে ডেটা লোকাল ডিভাইসে থাকে। অন্য ফোনে স্বয়ংক্রিয়ভাবে সিঙ্ক হয় না। লাইভ নোটিফিকেশন, আসল অনলাইন পেমেন্ট, ব্যবহারকারী লগইন ও ক্লাউড ব্যাকআপ চালু করতে Firebase কনফিগারেশন এবং নিরাপদ সার্ভার রুলস দরকার।</p></div>`}
function modal(title,fields,submit){$('#modalBody').innerHTML=`<h2>${title}</h2><form id="modalForm"><div class="form-grid">${fields}</div><div class="modal-actions"><button type="button" class="btn secondary" id="cancelModal">বাতিল</button><button class="btn" type="submit">সংরক্ষণ করুন</button></div></form>`;$('#modalBackdrop').classList.add('show');$('#cancelModal').onclick=closeModal;$('#modalForm').onsubmit=e=>{e.preventDefault();let form=e.target;let data=Object.fromEntries(new FormData(form));if(page==='gallery' && form.querySelector('input[type=file]')){let file=form.querySelector('input[type=file]').files[0];if(!file)return;let reader=new FileReader();reader.onload=()=>{db.gallery.push({id:Date.now(),title:data.title,data:reader.result});closeModal();save();render();toast('ছবি যোগ হয়েছে')};reader.readAsDataURL(file);return}submit(data);closeModal();save();render()}}
function field(label,name,placeholder='',type='text',full=false){return `<div class="field ${full?'full':''}"><label>${label}</label><input class="input" name="${name}" type="${type}" placeholder="${placeholder}" ${type==='number'?'min="0"':''} required></div>`}
function closeModal(){$('#modalBackdrop').classList.remove('show')}
function requirePin(cb){modal('অ্যাডমিন যাচাই',field('অ্যাডমিন PIN','pin','PIN','password'),d=>{if(d.pin===db.settings.adminPin)cb();else toast('ভুল PIN — আবার চেষ্টা করুন')})}
function wirePage(){
 const ry=$('#reportYear'),rm=$('#reportMonth');if(ry)ry.onchange=updatePeriodReport;if(rm)rm.onchange=updatePeriodReport;updatePeriodReport();
 $$('[data-go]').forEach(x=>x.onclick=()=>setPage(x.dataset.go));
 $$('[data-action]').forEach(x=>x.onclick=()=>action(x.dataset.action));
 $$('[data-delete]').forEach(x=>x.onclick=()=>requirePin(()=>{let [type,id]=x.dataset.delete.split(':');let key={notice:'notices',member:'members',event:'events',gallery:'gallery'}[type];db[key]=db[key].filter(y=>y.id!=id);save();render();toast('তথ্য মুছে ফেলা হয়েছে')}));
 $$('[data-library]').forEach(x=>x.onclick=()=>{if(x.dataset.library==='4')tasbih();else toast('এই বিভাগের কনটেন্ট অ্যাডমিন থেকে যুক্ত করা যাবে')});
}
function action(a){
 if(['addNotice','addDonation','addAccount','addMember','addEvent','addGallery','addBlood','emergency','editPrayer','goal','payment','pin','backup','restore','exportCsv'].includes(a)){requirePin(()=>adminAction(a));return}
 if(a==='calendar'){toast('মাসিক ক্যালেন্ডার: সময়সূচি অ্যাডমিন থেকে যাচাই করে যোগ করুন');return}
}
function adminAction(a){
 if(a==='addNotice')modal('নতুন ঘোষণা',field('শিরোনাম','title')+`<div class="field"><label>ধরন</label><select name="type"><option>সাধারণ</option><option>জরুরি</option><option>জুমা</option><option>জানাজা</option></select></div>`+field('তারিখ','date',new Date().toISOString().slice(0,10),'date')+`<div class="field full"><label>বিস্তারিত</label><textarea name="body" required></textarea></div>`,d=>db.notices.push({...d,id:Date.now()}));
 if(a==='addDonation')modal('বিস্তারিত অনুদান নিবন্ধন',field('দাতার নাম','name')+field('পরিমাণ (টাকা)','amount','','number')+field('তারিখ','date',new Date().toISOString().slice(0,10),'date')+`<div class="field"><label>অনুদানের খাত</label><select name="category"><option>সাধারণ দান</option><option>জুমার দান</option><option>যাকাত</option><option>সদকা</option><option>নির্মাণ ফান্ড</option><option>মাহফিল ফান্ড</option><option>মাসিক চাঁদা</option><option>অন্যান্য</option></select></div><div class="field"><label>মাধ্যম</label><select name="method"><option>নগদ</option><option>বিকাশ</option><option>নগদ (মোবাইল)</option><option>ব্যাংক</option></select></div>`+field('রসিদ নম্বর','receiptNo')+field('গ্রহণ/অনুমোদনকারী','approvedBy'),d=>db.donations.push({...d,amount:+d.amount,id:Date.now()}));
 if(a==='addAccount')modal('বিস্তারিত আয়-ব্যয়ের এন্ট্রি',`<div class="field"><label>লেনদেনের ধরন</label><select name="kind"><option>আয়</option><option>ব্যয়</option></select></div>`+field('পরিমাণ (টাকা)','amount','','number')+field('তারিখ','date',new Date().toISOString().slice(0,10),'date')+`<div class="field"><label>খাত</label><select name="category"><option>সাধারণ দান</option><option>জুমার দান</option><option>যাকাত</option><option>সদকা</option><option>নির্মাণ ফান্ড</option><option>মাহফিল ফান্ড</option><option>মাসিক চাঁদা</option><option>বিদ্যুৎ বিল</option><option>পানির বিল</option><option>ইমাম বেতন</option><option>মুয়াজ্জিন বেতন</option><option>খাদেম বেতন</option><option>পরিষ্কার-পরিচ্ছন্নতা</option><option>নির্মাণকাজ</option><option>মেরামত</option><option>মাইক ও সাউন্ড</option><option>মাহফিল ব্যয়</option><option>অন্যান্য</option></select></div>`+field('কোন উৎস/ফান্ড থেকে বা কোন ফান্ডে জমা','sourceFund','যেমন: নির্মাণ ফান্ড / সাধারণ ফান্ড')+field('দাতা/টাকা গ্রহণকারীর নাম','recipient','নাম')+field('রসিদ/ভাউচার নম্বর','receiptNo','রসিদ নম্বর')+field('অনুমোদনকারী','approvedBy','কমিটির অনুমোদনকারী')+field('বিস্তারিত বিবরণ','note','কী কারণে আয় বা ব্যয় হয়েছে','text',true),d=>db.accounts.push({...d,amount:+d.amount,id:Date.now()}));
 if(a==='addMember')modal('কমিটির সদস্য যোগ',field('নাম','name')+field('পদবি','role')+field('মোবাইল','phone')+field('বিবরণ','note','', 'text',true),d=>db.members.push({...d,id:Date.now()}));
 if(a==='addEvent')modal('নতুন ইভেন্ট',field('অনুষ্ঠানের নাম','title')+field('তারিখ','date','','date')+field('সময়','time','','time')+field('স্থান','place')+field('বিবরণ','note','', 'text',true),d=>db.events.push({...d,id:Date.now()}));
 if(a==='addGallery')modal('গ্যালারিতে ছবি যোগ',field('ছবির নাম','title')+`<div class="field full"><label>ছবি নির্বাচন</label><input class="input" type="file" name="photo" accept="image/*" required></div>`,async d=>{});
 if(a==='addBlood')modal('স্বেচ্ছায় রক্তদাতা নিবন্ধন',field('নাম','name')+field('রক্তের গ্রুপ','group')+field('যোগাযোগ নম্বর','phone')+field('এলাকা','area'),d=>{db.members.push({id:Date.now(),name:d.name,role:'স্বেচ্ছায় রক্তদাতা · '+d.group,phone:d.phone,note:'এলাকা: '+d.area+' · সম্মতিতে নিবন্ধিত'});});
 if(a==='emergency')modal('জরুরি যোগাযোগ যোগ',field('সেবার নাম','name')+field('যোগাযোগ নম্বর','phone')+field('বিবরণ','note'),d=>db.members.push({...d,id:Date.now(),role:'জরুরি যোগাযোগ'}));
 if(a==='editPrayer'){
   const ks=Object.keys(db.prayer).filter(k=>k!=='ইকামত'),bd2=v=>String(v||'').replace(/[০-৯]/g,d=>'০১২৩৪৫৬৭৮৯'.indexOf(d)).trim(),pd=n=>String(n).padStart(2,'0');
   const norm=(v,k)=>{let m=/^(\d{1,2}):(\d{2})$/.exec(bd2(v)),h=m?+m[1]:NaN,mi=m?+m[2]:NaN;if(!(h<24&&mi<60)){m=/^(\d{1,2}):(\d{2})$/.exec((typeof defaults!=='undefined'&&defaults.prayer[k])||'');h=m?+m[1]:0;mi=m?+m[2]:0}return h*60+mi};
   const fmt=t=>{const h=Math.floor(t/60),m=t%60;return{a:pd(h)+':'+pd(m),b:((h%12)||12)+':'+pd(m)+' '+(h>=12?'PM':'AM')}};
   const row=k=>{const t=norm(db.prayer[k],k),f=fmt(t);return `<div class="field full"><label>${k}</label><div class="tstep" data-t="${t}"><button type="button" data-d="-5" aria-label="৫ মিনিট কমান">−</button><input class="input" name="p_${k}" value="${f.a}" readonly><button type="button" data-d="5" aria-label="৫ মিনিট বাড়ান">+</button><span class="ap">${f.b}</span></div></div>`};
   modal('নামাজের সময়',ks.map(row).join(''),d=>{ks.forEach(k=>{if(d['p_'+k])db.prayer[k]=d['p_'+k]})});
   if(!$('#tstepCss')){const st=document.createElement('style');st.id='tstepCss';st.textContent='.tstep{display:flex;align-items:center;gap:8px}.tstep button{flex:0 0 46px;height:46px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:inherit;font:700 24px sans-serif;cursor:pointer;touch-action:manipulation}.tstep button:active{transform:scale(.94)}.tstep .input{flex:1;min-width:0;text-align:center;font-weight:700;font-size:20px}.tstep .ap{flex:0 0 74px;font-size:13px;opacity:.85;text-align:center}';document.head.appendChild(st)}
   $('#modalForm').addEventListener('click',e=>{const b=e.target.closest('.tstep button');if(!b)return;const w=b.closest('.tstep'),t=(((+w.dataset.t+ +b.dataset.d)%1440)+1440)%1440,f=fmt(t);w.dataset.t=t;w.querySelector('input').value=f.a;w.querySelector('.ap').textContent=f.b});
  }
  if(a==='goal')modal('অনুদানের লক্ষ্যমাত্রা',field('লক্ষ্যমাত্রা (টাকা)','goal','','number'),d=>db.settings.goal=+d.goal);
 if(a==='payment')modal('পেমেন্ট তথ্য',field('বিকাশ নম্বর','bkash')+field('নগদ নম্বর','nagad')+field('ব্যাংক তথ্য','bank','ব্যাংকের নাম ও হিসাব'),d=>Object.assign(db.settings,d));
 if(a==='pin')modal('অ্যাডমিন PIN পরিবর্তন',field('নতুন PIN','pin','কমপক্ষে ৪ অঙ্ক','password'),d=>db.settings.adminPin=d.pin);
 if(a==='backup'){download('gopinathpur-masjid-backup.json',JSON.stringify(db,null,2),'application/json');toast('ব্যাকআপ ডাউনলোড শুরু হয়েছে')}
 if(a==='restore'){let inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.onchange=()=>{let r=new FileReader();r.onload=()=>{try{db={...defaults,...JSON.parse(r.result)};save();render();toast('ব্যাকআপ রিস্টোর হয়েছে')}catch(e){toast('ফাইলটি সঠিক JSON নয়')}};r.readAsText(inp.files[0])};inp.click()}
 if(a==='exportCsv'){let all=[...db.accounts,...db.donations.map(x=>({...x,kind:'আয়',note:'অনুদান',sourceFund:x.category,recipient:x.name}))];let rows=[['তারিখ','ধরন','খাত','বিবরণ','উৎস ফান্ড','দাতা/গ্রহণকারী','রসিদ নম্বর','অনুমোদনকারী','পরিমাণ'],...all.map(x=>[x.date,x.kind,x.category,x.note,x.sourceFund,x.recipient||x.name,x.receiptNo,x.approvedBy,x.amount])];download('gopinathpur-masjid-detailed-accounts.csv','\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv');toast('বিস্তারিত CSV ডাউনলোড শুরু হয়েছে')}
}
function download(name,data,type){let a=document.createElement('a'),url=URL.createObjectURL(new Blob([data],{type}));a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
function tasbih(){let count=0;$('#modalBody').innerHTML=`<h2>ডিজিটাল তাসবিহ</h2><div style="text-align:center;padding:25px"><div class="muted">তাসবিহ গণনা</div><div id="tasCount" style="font:800 65px Manrope;color:var(--green)">০</div><button class="btn" id="tasAdd" style="padding:18px 35px;border-radius:50%;font-size:20px">＋</button><p><button class="btn secondary" id="tasReset">রিসেট</button></p></div>`;$('#modalBackdrop').classList.add('show');$('#tasAdd').onclick=()=>{$('#tasCount').textContent=(++count).toLocaleString('bn-BD')};$('#tasReset').onclick=()=>{$('#tasCount').textContent=(count=0).toLocaleString('bn-BD')}}
$('#nav').onclick=e=>{let b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)};
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');$('#closeModal').onclick=closeModal;$('#modalBackdrop').onclick=e=>{if(e.target.id==='modalBackdrop')closeModal()};$('#adminShortcut').onclick=()=>setPage('admin');$('#notifyBtn').onclick=()=>{if('Notification'in window)Notification.requestPermission().then(p=>toast(p==='granted'?'নোটিফিকেশন অনুমতি চালু হয়েছে':'অনুমতি দেওয়া হয়নি'));else toast('এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়')};
$('#year').textContent=new Date().getFullYear();render();
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});

/* ===== premium.js ===== */
(function(){
const order=['ফজর','যোহর','আসর','মাগরিব','এশা'],bd=n=>Number(n).toLocaleString('bn-BD',{minimumIntegerDigits:2,useGrouping:false});
let nx=null;
function nextPrayer(){const now=new Date(),fri=now.getDay()===5;
 const list=order.map(k=>{const j=k==='যোহর'&&fri,t=(j?db.prayer.জুমা:db.prayer[k])||'',[h,m]=t.split(':').map(Number),d=new Date(now);d.setHours(h,m,0,0);return{key:k,name:j?'জুমা':k,d}}).filter(x=>!isNaN(x.d));
 return list.find(x=>x.d>now)||(list[0]&&{...list[0],d:new Date(list[0].d.getTime()+864e5)})}
function hijri(){try{return new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}
function tick(){const el=$('#nxCd');if(!el||!nx)return;let s=Math.max(0,Math.floor((nx.d-new Date())/1e3));if(!s){nx=nextPrayer();return dress()}el.textContent=bd(s/3600|0)+':'+bd(s%3600/60|0)+':'+bd(s%60)}
function dress(){
 $('#dateLine').textContent=dateBn()+(hijri()?' · '+hijri():'');
 $$('.dock button').forEach(b=>b.classList.toggle('on',b.dataset.page===page));
 if(page!=='home')return;nx=nextPrayer();if(!nx)return;
 const hd=$('.hero');if(hd&&!$('.mihrab')){hd.insertAdjacentHTML('beforeend',`<div class="mihrab"><small>পরবর্তী ওয়াক্ত</small><b>${nx.name}</b><div class="cd" id="nxCd"></div><small id="nxAt"></small></div>`)}
 $$('.prayer-card').forEach(c=>{const on=c.querySelector('span').textContent===nx.key;c.classList.toggle('next',on);c.querySelector('em').textContent=on?'পরবর্তী ওয়াক্ত':'নামাজের সময়'});tick()}

/* ---- ১২/২৪ ঘণ্টার ঘড়ি ---- */
const b1=n=>Number(n).toLocaleString('bn-BD',{useGrouping:false}),KEY24='clk24';
let h24=false;try{h24=localStorage.getItem(KEY24)==='1'}catch(e){}
const orig=new WeakMap();
function ap(h){return h>=12?'PM':'AM'}
function bnTime(d){const h=d.getHours(),m=d.getMinutes();return h24?bd(h)+':'+bd(m):b1(h%12||12)+':'+bd(m)+' '+ap(h)}
function lat(h,m){return h24?String(h).padStart(2,'0')+':'+m:((h%12)||12)+':'+m+' '+ap(h)}
function applyClock(){
 document.body.classList.toggle('h12',!h24);
 const root=$('#content');if(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){let o=orig.get(n);if(o===undefined){if(!/\d{1,2}:\d{2}/.test(n.nodeValue))continue;o=n.nodeValue;orig.set(n,o)}
   const v=o.replace(/\b(\d{1,2}):(\d{2})\b/g,(x,h,m)=>+h<24&&+m<60?lat(+h,m):x);if(n.nodeValue!==v)n.nodeValue=v}}
 const at=$('#nxAt');if(at&&nx)at.textContent=bnTime(nx.d)+'-এ';
 const cb=$('#clockBtn');if(cb){cb.textContent=bnTime(new Date());cb.title=h24?'২৪ ঘণ্টা — চাপলে ১২ ঘণ্টা':'১২ ঘণ্টা — চাপলে ২৪ ঘণ্টা'}
}
{const cb=document.createElement('button');cb.id='clockBtn';cb.className='icon-btn clock-btn';$('.top-actions').prepend(cb);
 cb.onclick=()=>{h24=!h24;try{localStorage.setItem(KEY24,h24?'1':'0')}catch(e){}applyClock();toast(h24?'২৪ ঘণ্টার ঘড়ি চালু':'১২ ঘণ্টার ঘড়ি চালু')}}
const _d0=dress;dress=function(){_d0();applyClock()};
window._dress=dress;const _r=render;render=function(){_r();dress()};
$('#dock').onclick=e=>{const b=e.target.closest('button');if(!b)return;b.dataset.page?setPage(b.dataset.page):$('#sidebar').classList.toggle('open')};
let dp=null;const ib=$('#installBtn'),ios=/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches;
if(ios)ib.hidden=false;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;ib.hidden=false});
addEventListener('appinstalled',()=>{ib.hidden=true;toast('অ্যাপ ইনস্টল হয়েছে')});
ib.onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;ib.hidden=true}else if(ios)toast('Safari-র Share বোতাম → “Add to Home Screen” চাপুন')};
setInterval(()=>{tick();const cb=$('#clockBtn');if(cb)cb.textContent=bnTime(new Date())},1000);dress();
})();

/* ===== cloud.js ===== */
(function(){
const C=window.FIREBASE_CONFIG||{},OWNER=(window.OWNER_EMAIL||'').toLowerCase(),ON=!!(C.apiKey&&!/^YOUR_/.test(C.apiKey));
let F,U,S,fs,auth,st,me=null,role='none',archive=[],donors=[],team=[],arcYear=null,bFilter='',unTeam=null;
const CATS=['সাধারণ দান','জুমার দান','যাকাত','সদকা','নির্মাণ ফান্ড','মাহফিল ফান্ড','মাসিক চাঁদা','বিদ্যুৎ বিল','পানির বিল','ইমাম বেতন','মুয়াজ্জিন বেতন','খাদেম বেতন','পরিষ্কার-পরিচ্ছন্নতা','নির্মাণকাজ','মেরামত','মাইক ও সাউন্ড','মাহফিল ব্যয়','অন্যান্য'];
const GROUPS=['A+','A-','B+','B-','O+','O-','AB+','AB-'],isAdm=()=>!ON||role!=='none';
const fail=e=>toast('ব্যর্থ হয়েছে: '+((e&&e.code)||'আবার চেষ্টা করুন'));
const need=()=>'<div class="notice-banner">এই সুবিধা চালু করতে <b>firebase-config.js</b>-এ Firebase তথ্য বসান। ধাপগুলো README.md-তে আছে।</div>';
const shrink=(f,max,q)=>new Promise(r=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>r(b||f),'image/jpeg',q)};i.onerror=()=>r(f);i.src=u});
/* ---------- extra pages ---------- */
function pgArchive(){if(!ON)return need();
 const ys=[...new Set(archive.map(x=>x.year))].sort((a,b)=>b-a),y=ys.includes(arcYear)?arcYear:ys[0],list=archive.filter(x=>x.year===y),cats=[...new Set(list.map(x=>x.category))];
 return `<div class="toolbar"><h2>পুরোনো বছরের হিসাব</h2>${isAdm()?'<button class="btn" data-arcadd>＋ খাতার PDF যোগ</button>':''}</div><div class="notice-banner">আগের বছরের হাতে লেখা খাতা স্ক্যান করে খাত অনুযায়ী রাখা হয়েছে। ছবি বা PDF-এ চাপ দিলে বড় করে দেখা যাবে।</div>`+(ys.length?`<div class="chips">${ys.map(v=>`<button class="chip ${v===y?'on':''}" data-year="${v}">${v}</button>`).join('')}</div>`+cats.map(c=>{const L=list.filter(x=>x.category===c);return `<div class="section-head"><h3>${esc(c)}</h3><small>${L.length}টি ফাইল</small></div><div class="grid arc-grid">${L.map(f=>`<div class="arc"><a href="${esc(f.url)}" target="_blank" rel="noopener">${f.type==='pdf'?'<div class="arc-pdf">PDF</div>':`<img loading="lazy" src="${esc(f.url)}" alt="${esc(f.title)}">`}</a><b>${esc(f.title)}</b>${isAdm()?`<button class="btn danger small" data-arcdel="${esc(f.id)}">মুছুন</button>`:''}</div>`).join('')}</div>`}).join(''):'<div class="panel empty">এখনো কোনো পুরোনো হিসাব তোলা হয়নি</div>');}
function pgBlood(){if(!ON)return need();
 const L=donors.filter(d=>!bFilter||d.group===bFilter);
 return `<div class="toolbar"><h2>স্বেচ্ছায় রক্তদাতা (${L.length})</h2><div class="actions"><select id="bf" style="width:auto"><option value="">সব গ্রুপ</option>${GROUPS.map(g=>`<option ${g===bFilter?'selected':''}>${g}</option>`).join('')}</select><button class="btn" data-bform>রক্তদাতা হিসেবে নিবন্ধন</button></div></div><div class="grid page-grid">${L.map(d=>`<div class="page-card"><div class="member"><div class="avatar">${esc(d.group)}</div><div><b>${esc(d.name)}</b><div class="subtle">${esc(d.area||'')}</div></div></div><div class="actions" style="margin-top:12px"><a class="btn secondary small" href="tel:${esc(d.phone)}" style="text-decoration:none">☎ ${esc(d.phone)}</a>${isAdm()?`<button class="btn danger small" data-bdel="${esc(d.id)}">মুছুন</button>`:''}</div></div>`).join('')||'<div class="panel empty">এখনো কেউ নিবন্ধন করেননি</div>'}</div>`;}
function pgTeam(){if(!ON)return need();if(role!=='owner')return '<div class="panel empty">এই পেজ শুধু মালিকের জন্য</div>';const full=team.length>=10;
 return `<div class="toolbar"><h2>অ্যাডমিন ব্যবস্থাপনা (${team.length}/১০)</h2></div><div class="notice-banner">এখানে যে Gmail যোগ করবেন শুধু সে-ই Google দিয়ে লগইন করে তথ্য লিখতে পারবে। “বন্ধ” করলে সঙ্গে সঙ্গে তার ক্ষমতা চলে যাবে। মালিক হিসেবে আপনাকে কেউ বাদ দিতে পারবে না।</div><form class="panel" id="teamForm"><div class="form-grid"><div class="field"><label>নাম</label><input class="input" name="name" required></div><div class="field"><label>Gmail</label><input class="input" name="email" type="email" required></div></div><div class="modal-actions"><button class="btn" ${full?'disabled':''}>অ্যাডমিন যোগ করুন</button></div>${full?'<div class="subtle">১০ জনের সীমা পূর্ণ। নতুন যোগ করতে আগে একজনকে মুছুন।</div>':''}</form><div class="table-wrap" style="margin-top:14px"><table class="data-table"><thead><tr><th>নাম</th><th>Gmail</th><th>অবস্থা</th><th></th></tr></thead><tbody>${team.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(t.email)}</td><td><span class="tag">${t.active?'চালু':'বন্ধ'}</span></td><td><div class="actions"><button class="btn secondary small" data-tt="${esc(t.email)}">${t.active?'বন্ধ করুন':'চালু করুন'}</button><button class="btn danger small" data-td="${esc(t.email)}">মুছুন</button></div></td></tr>`).join('')||'<tr><td colspan="4" class="empty">এখনো কোনো অ্যাডমিন যোগ করা হয়নি</td></tr>'}</tbody></table></div>`;}
function pgAdmin(){
 if(role==='none')return '<div class="panel login"><div class="login-mark">☾</div><h3>অ্যাডমিন লগইন</h3><p class="muted">শুধু অনুমোদিত অ্যাডমিনরা Google দিয়ে লগইন করে তথ্য যোগ বা পরিবর্তন করতে পারবেন। অন্য সবাই সব তথ্য শুধু দেখতে পারবেন।</p><button class="btn" data-login>Google দিয়ে লগইন</button></div>';
 const K=(t,p,b)=>`<div class="page-card"><h3>${t}</h3><p>${p}</p>${b}</div>`;
 return `<div class="notice-banner">লগইন: <b>${esc(me.email)}</b> (${role==='owner'?'মালিক':'অ্যাডমিন'})</div><div class="grid page-grid">${K('🕌 নামাজের সময়','দৈনিক নামাজের সময় হালনাগাদ করুন।','<button class="btn" data-action="editPrayer">সময় সম্পাদনা</button>')}${K('📢 ঘোষণা','নতুন নোটিশ প্রকাশ করুন।','<button class="btn" data-action="addNotice">ঘোষণা প্রকাশ</button>')}${K('💰 অনুদানের লক্ষ্য','ফান্ডের লক্ষ্য নির্ধারণ করুন।','<button class="btn" data-action="goal">লক্ষ্যমাত্রা সেট</button>')}${K('📲 পেমেন্ট তথ্য','বিকাশ, নগদ ও ব্যাংকের তথ্য।','<button class="btn" data-action="payment">তথ্য সম্পাদনা</button>')}${K('🗂 পুরোনো হিসাব','খাতার PDF যোগ করুন।','<button class="btn" data-go="archive">আর্কাইভে যান</button>')}${K('▣ QR পোস্টার','দেয়ালে লাগানোর জন্য প্রিন্ট করুন।','<a class="btn secondary" href="qr.html" target="_blank" style="text-decoration:none;display:inline-block">QR তৈরি করুন</a>')}${role==='owner'?K('👥 অ্যাডমিন ব্যবস্থাপনা','অ্যাডমিন যোগ, চালু/বন্ধ ও মুছুন।','<button class="btn" data-go="team">ব্যবস্থাপনা</button>'):''}${K('📄 ব্যাকআপ','সব তথ্য JSON ফাইলে নামান।','<button class="btn secondary" data-action="backup">ব্যাকআপ</button>')}${K('🚪 লগআউট','এই ডিভাইস থেকে বের হন।','<button class="btn danger" data-logout>লগআউট</button>')}</div>`;}
const EXTRA={archive:pgArchive,blood:pgBlood,team:pgTeam},TITLES={archive:'পুরোনো বছরের হিসাব',blood:'রক্তদাতা তালিকা',team:'অ্যাডমিন ব্যবস্থাপনা'};
/* ---------- modals ---------- */
function upModal(){$('#modalBody').innerHTML=`<h2>পুরোনো হিসাবের ফাইল যোগ</h2><div class="notice-banner" style="font-size:12px">আগে PDF/ছবিটা সাইটের <b>archive</b> ফোল্ডারে (যেমন <b>archive/2024/jumar.pdf</b>) আপলোড করুন। তারপর এখানে তার নাম লিখুন।</div><form id="upForm"><div class="form-grid"><div class="field"><label>সাল</label><input class="input" name="year" type="number" min="1990" max="2100" value="${new Date().getFullYear()-1}" required></div><div class="field"><label>খাত</label><select name="category">${CATS.map(c=>`<option>${c}</option>`).join('')}</select></div><div class="field full"><label>পাতার নাম/বিবরণ (যেমন: জুমার দান, জানুয়ারি–মার্চ)</label><input class="input" name="title" required></div><div class="field full"><label>ফাইলের পথ (archive/ এর পরের অংশ, ইংরেজিতে)</label><input class="input" name="path" placeholder="2024/jumar.pdf" required></div></div><div class="modal-actions"><button type="button" class="btn secondary" id="upCancel">বাতিল</button><button class="btn">যোগ করুন</button></div></form>`;
 $('#modalBackdrop').classList.add('show');$('#upCancel').onclick=closeModal;
 $('#upForm').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),path=d.path.trim().replace(/^\/+/,'').replace(/^archive\//,'');
  if(!/^[\w\-./ ]+\.(pdf|jpe?g|png|webp)$/i.test(path)||path.includes('..'))return toast('ফাইলের নাম ইংরেজিতে ও .pdf/.jpg/.png হতে হবে');
  F.addDoc(F.collection(fs,'archive'),{year:+d.year,category:d.category,title:d.title.trim(),url:'archive/'+encodeURI(path),path,type:/\.pdf$/i.test(path)?'pdf':'image',createdAt:F.serverTimestamp()}).then(()=>{closeModal();arcYear=+d.year;toast('যোগ হয়েছে')}).catch(fail)}}
function bForm(){$('#modalBody').innerHTML=`<h2>স্বেচ্ছায় রক্তদাতা নিবন্ধন</h2><form id="bfForm"><div class="form-grid"><div class="field"><label>নাম</label><input class="input" name="name" minlength="2" maxlength="60" required></div><div class="field"><label>রক্তের গ্রুপ</label><select name="group">${GROUPS.map(g=>`<option>${g}</option>`).join('')}</select></div><div class="field"><label>মোবাইল (ইংরেজি সংখ্যায়, যেমন 017XXXXXXXX)</label><input class="input" name="phone" inputmode="numeric" pattern="01[0-9]{9}" required></div><div class="field"><label>এলাকা</label><input class="input" name="area" maxlength="80" required></div></div><label class="chk"><input type="checkbox" required> আমি নিজের ইচ্ছায় নাম ও মোবাইল নম্বর সবার জন্য প্রকাশ করতে সম্মত।</label><div class="modal-actions"><button type="button" class="btn secondary" id="bfCancel">বাতিল</button><button class="btn">নিবন্ধন করুন</button></div></form>`;
 $('#modalBackdrop').classList.add('show');$('#bfCancel').onclick=closeModal;
 $('#bfForm').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));F.addDoc(F.collection(fs,'bloodDonors'),{name:d.name.trim(),group:d.group,phone:d.phone.trim(),area:d.area.trim(),createdAt:F.serverTimestamp()}).then(()=>{closeModal();toast('নিবন্ধন সম্পন্ন হয়েছে। ধন্যবাদ')}).catch(fail)}}
function wireExtra(){if(!ON)return;
 $$('[data-login]').forEach(b=>b.onclick=()=>U.signInWithPopup(auth,new U.GoogleAuthProvider()).catch(fail));
 $$('[data-logout]').forEach(b=>b.onclick=()=>U.signOut(auth).then(()=>{toast('লগআউট হয়েছে');render()}));
 $$('[data-year]').forEach(b=>b.onclick=()=>{arcYear=+b.dataset.year;render()});
 $$('[data-arcadd]').forEach(b=>b.onclick=upModal);
 $$('[data-arcdel]').forEach(b=>b.onclick=async()=>{if(!confirm('এই ফাইলটি মুছে ফেলবেন?'))return;const f=archive.find(x=>x.id===b.dataset.arcdel);try{await F.deleteDoc(F.doc(fs,'archive',f.id));}catch(e){fail(e)}});
 $$('[data-bform]').forEach(b=>b.onclick=bForm);
 $$('[data-bdel]').forEach(b=>b.onclick=()=>confirm('এই রক্তদাতাকে মুছবেন?')&&F.deleteDoc(F.doc(fs,'bloodDonors',b.dataset.bdel)).catch(fail));
 const bf=$('#bf');if(bf)bf.onchange=()=>{bFilter=bf.value;render()};
 const tf=$('#teamForm');if(tf)tf.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(tf)),em=d.email.trim().toLowerCase();if(em===OWNER)return toast('এটি মালিকের Gmail, আগে থেকেই সব ক্ষমতা আছে');if(team.length>=10)return;F.setDoc(F.doc(fs,'admins',em),{email:em,name:d.name.trim(),active:true}).then(()=>{tf.reset();toast('অ্যাডমিন যোগ হয়েছে')}).catch(fail)};
 $$('[data-tt]').forEach(b=>b.onclick=()=>{const t=team.find(x=>x.email===b.dataset.tt);F.updateDoc(F.doc(fs,'admins',t.email),{active:!t.active}).then(()=>toast(t.active?'বন্ধ করা হয়েছে':'চালু করা হয়েছে')).catch(fail)});
 $$('[data-td]').forEach(b=>b.onclick=()=>confirm('এই অ্যাডমিনকে মুছবেন?')&&F.deleteDoc(F.doc(fs,'admins',b.dataset.td)).catch(fail));}
/* ---------- render wrapper ---------- */
const _render=render;
render=function(){if(EXTRA[page]){$('#pageTitle').textContent=TITLES[page];$('#content').innerHTML=EXTRA[page]();wirePage();window._dress&&_dress()}else _render();wireExtra()};
if(!ON){document.body.classList.add('is-admin','is-owner');return}
/* ---------- firebase ---------- */
const B='https://www.gstatic.com/firebasejs/10.14.1/';
Promise.all(['app','firestore','auth'].map(n=>import(B+'firebase-'+n+'.js'))).then(([A,Fs,Au])=>{
 F=Fs;U=Au;const app=A.initializeApp(C);fs=F.initializeFirestore(app,{localCache:F.persistentLocalCache()});auth=U.getAuth(app);
 const COLS=['notices','donations','accounts','members','events','gallery'],LAST={},LS={};
 COLS.forEach(c=>{LAST[c]=new Map();F.onSnapshot(F.collection(fs,c),s=>{const a=s.docs.map(d=>d.data()).sort((x,y)=>x.id-y.id);db[c]=a;LAST[c]=new Map(a.map(x=>[String(x.id),JSON.stringify(x)]));render()},e=>console.warn(c,e))});
 const one=(c,fn)=>F.onSnapshot(F.doc(fs,c,'main'),s=>{if(s.exists()){fn(s.data());LS[c]=JSON.stringify(s.data());render()}},()=>{});
 one('settings',d=>db.settings={...db.settings,...d});one('prayer',d=>db.prayer=d);
 F.onSnapshot(F.collection(fs,'archive'),s=>{archive=s.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>b.year-a.year||String(a.title).localeCompare(b.title));render()},()=>{});
 F.onSnapshot(F.collection(fs,'bloodDonors'),s=>{donors=s.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>a.group.localeCompare(b.group));render()},()=>{});
 save=function(){if(role==='none')return;
  COLS.forEach(c=>{const cur=new Map(db[c].map(x=>[String(x.id),x]));cur.forEach((x,id)=>{if(LAST[c].get(id)!==JSON.stringify(x))F.setDoc(F.doc(fs,c,id),x).catch(fail)});LAST[c].forEach((_,id)=>{if(!cur.has(id))F.deleteDoc(F.doc(fs,c,id)).catch(fail)})});
  const s={goal:db.settings.goal,bkash:db.settings.bkash||'',nagad:db.settings.nagad||'',bank:db.settings.bank||''};
  if(JSON.stringify(s)!==LS.settings)F.setDoc(F.doc(fs,'settings','main'),s).catch(fail);
  if(JSON.stringify(db.prayer)!==LS.prayer)F.setDoc(F.doc(fs,'prayer','main'),db.prayer).catch(fail)};
 requirePin=cb=>{if(role!=='none')cb();else{toast('এই কাজ শুধু অ্যাডমিন করতে পারেন');setPage('admin')}};
 const _action=action;action=function(a){if(a==='addBlood')return bForm();if(a==='exportCsv')return adminAction(a);_action(a)};
 admin=pgAdmin;
 const _rad=FileReader.prototype.readAsDataURL;FileReader.prototype.readAsDataURL=function(f){if(page==='gallery'&&f.type.startsWith('image/')){shrink(f,1000,.72).then(b=>{const r=new FileReader;r.onload=()=>{Object.defineProperty(this,'result',{value:r.result});this.onload&&this.onload()};_rad.call(r,b)})}else _rad.call(this,f)};

 /* ---------- push notification ---------- */
 const MS=()=>import(B+'firebase-messaging.js');
 const vapidOk=()=>window.VAPID_KEY&&!/^YOUR_/.test(window.VAPID_KEY);
 const listen=async()=>{try{const M=await MS();M.onMessage(M.getMessaging(app),m=>toast((m.notification&&(m.notification.title+' — '+m.notification.body))||'নতুন বার্তা'))}catch(e){}};
 async function api(path,body){const r=await fetch(window.PUSH_API+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw{code:'সার্ভার সাড়া দেয়নি'}}
 async function pushOn(pr){
  if(!('Notification'in window)||!('serviceWorker'in navigator))return toast('এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়');
  if(!vapidOk()||!window.PUSH_API||/YOUR-/.test(window.PUSH_API))return toast('firebase-config.js-এ VAPID_KEY ও PUSH_API বসানো হয়নি');
  if(await Notification.requestPermission()!=='granted')return toast('অনুমতি দেওয়া হয়নি');
  try{const M=await MS(),reg=await navigator.serviceWorker.ready,tok=await M.getToken(M.getMessaging(app),{vapidKey:window.VAPID_KEY,serviceWorkerRegistration:reg});
   await api('/subscribe',{token:tok,notice:pr.notice,prayer:pr.prayer});
   localStorage.setItem('push_token',tok);localStorage.setItem('push_pref',JSON.stringify(pr));listen();toast('নোটিফিকেশন চালু হয়েছে')}catch(e){console.error(e);fail(e)}}
 async function pushOff(){const tok=localStorage.getItem('push_token');
  if(tok){await api('/unsubscribe',{token:tok}).catch(()=>{});try{const M=await MS();await M.deleteToken(M.getMessaging(app))}catch(e){}}
  localStorage.removeItem('push_token');toast('নোটিফিকেশন বন্ধ হয়েছে')}
 function notifModal(){const on=!!localStorage.getItem('push_token'),pr=JSON.parse(localStorage.getItem('push_pref')||'{"notice":true,"prayer":true}');
  $('#modalBody').innerHTML=`<h2>নোটিফিকেশন</h2><p class="muted" style="font-size:13px;margin-top:0">নতুন ঘোষণা ও জামাতের আগে ফোনে বার্তা পাবেন। অ্যাপ বন্ধ থাকলেও আসবে।</p><label class="chk" style="margin:10px 0"><input type="checkbox" id="pn" ${pr.notice?'checked':''}> নতুন ঘোষণা ও জরুরি নোটিশ (জানাজাসহ)</label><label class="chk" style="margin:10px 0"><input type="checkbox" id="pp" ${pr.prayer?'checked':''}> জামাতের ১০ মিনিট আগে নামাজের রিমাইন্ডার</label><div class="subtle">iPhone-এ Safari থেকে “Share → Add to Home Screen” করে হোম স্ক্রিনের অ্যাপ খুলে চালু করতে হবে।</div><div class="modal-actions">${on?'<button class="btn danger" id="pOff">বন্ধ করুন</button>':''}<button class="btn" id="pOn">${on?'পছন্দ সংরক্ষণ':'চালু করুন'}</button></div>`;
  $('#modalBackdrop').classList.add('show');$('#pOn').onclick=async()=>{const v={notice:$('#pn').checked,prayer:$('#pp').checked};closeModal();await pushOn(v)};const o=$('#pOff');if(o)o.onclick=async()=>{closeModal();await pushOff()}}
 $('#notifyBtn').onclick=notifModal;
 if(localStorage.getItem('push_token')&&Notification.permission==='granted')listen();
 U.onAuthStateChanged(auth,async u=>{me=u;role='none';
  if(u){const em=(u.email||'').toLowerCase();if(u.emailVerified){if(em===OWNER)role='owner';else try{const s=await F.getDoc(F.doc(fs,'admins',em));if(s.exists()&&s.data().active===true)role='admin'}catch(e){}}
   if(role==='none'){toast('এই Gmail অ্যাডমিন নয়। আপনি শুধু দেখতে পারবেন।');U.signOut(auth);return}}
  document.body.classList.toggle('is-admin',role!=='none');document.body.classList.toggle('is-owner',role==='owner');
  $('#adminShortcut').textContent=u?(u.displayName||u.email)[0].toUpperCase():'A';
  if(unTeam){unTeam();unTeam=null;team=[]}
  if(role==='owner')unTeam=F.onSnapshot(F.collection(fs,'admins'),s=>{team=s.docs.map(d=>d.data()).sort((a,b)=>a.email.localeCompare(b.email));render()},()=>{});
  render()});
}).catch(e=>{console.error(e);toast('অনলাইন সংযোগ চালু করা যায়নি')});
})();

/* ===== fixes.js ===== */
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

/* ===== features.js ===== */
/* কুরআন রিডার (বাংলা + রঙিন তাজবিদ), কিবলা কম্পাস, ডার্ক মোড */
(function(){
const mbk=$('#modalBackdrop'),bn=n=>Number(n).toLocaleString('bn-BD',{useGrouping:false});
const open=h=>{$('#modalBody').innerHTML=h;mbk.classList.add('show')};
const get=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.json()});
let surahs=null;
/* ---- কুরআন ---- */
async function quran(mode){
 open('<h2>📖 কুরআন মাজিদ</h2><p class="muted">লোড হচ্ছে…</p>');
 try{surahs=surahs||(await get('https://api.alquran.cloud/v1/surah')).data}catch(e){return open('<h2>📖 কুরআন মাজিদ</h2><div class="notice-banner">ইন্টারনেট সংযোগ লাগবে। সংযোগ দিয়ে আবার চেষ্টা করুন।</div>')}
 open(`<h2>${mode==='tj'?'🎨 রঙিন তাজবিদ কুরআন':'📖 কুরআন — বাংলা অনুবাদ'}</h2><div class="field"><select id="qs">${surahs.map(s=>`<option value="${s.number}">${bn(s.number)}. ${s.name} (${s.englishName})</option>`).join('')}</select></div>${mode==='tj'?'<div class="tj-key"><i class="tj ghunnah">গুন্নাহ</i><i class="tj ikhfa">ইখফা</i><i class="tj idgham_ghunnah">ইদগাম</i><i class="tj iqlab">ইকলাব</i><i class="tj qalqalah">কলকলা</i><i class="tj madda_normal">মাদ</i><i class="tj ham_wasl">ওয়াসল</i></div>':''}<div id="qb" class="qb"></div>`);
 const load=async()=>{const n=$('#qs').value,b=$('#qb');b.innerHTML='<p class="muted">লোড হচ্ছে…</p>';
  try{
   if(mode==='tj'){const d=await get('https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number='+n);
    b.innerHTML=d.verses.map(v=>`<div class="ay"><div class="ar">${v.text_uthmani_tajweed.replace(/<tajweed class=([a-z_]+)>/g,'<i class="tj $1">').replace(/<\/tajweed>/g,'</i>').replace(/<span class=end>([^<]*)<\/span>/g,'﴿$1﴾').replace(/<(?!\/?i[ >])[^>]*>/g,'')}</div></div>`).join('')}
   else{const d=(await get('https://api.alquran.cloud/v1/surah/'+n+'/editions/quran-uthmani,bn.bengali')).data;
    b.innerHTML=d[0].ayahs.map((a,i)=>`<div class="ay"><div class="ar">${esc(a.text)} ﴿${bn(a.numberInSurah)}﴾</div><p>${esc(d[1].ayahs[i].text)}</p></div>`).join('')}
  }catch(e){b.innerHTML='<div class="notice-banner">সূরাটি লোড করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।</div>'}};
 $('#qs').onchange=load;load()}
/* ---- কিবলা কম্পাস (নামাজের পেজে, নিজে চালু হয়) ---- */
let QB=+sessionStorage.getItem('qb')||null,QH=null,QL=false,QR=0,QS=false;
const qd=(a,b)=>((a-b)%360+540)%360-180;
function qUpd(){const d=$('#qdial');if(!d)return;const B=QB||278,c=$('#qcard'),t=$('#qTxt'),m=$('.qm');if(m)m.style.transform='rotate('+B+'deg)';
 if(QH==null){t.textContent='কাবার দিক: উত্তর থেকে '+bn(Math.round(B))+'°'+(QB?'':' (আনুমানিক, বাংলাদেশ)');return}
 const g=$('#qGo');if(g)g.hidden=true;QR+=qd(-QH,QR);d.style.transform='rotate('+QR+'deg)';const ok=Math.abs(qd(B,QH))<6;c.classList.toggle('ok',ok);
 t.textContent=ok?'✓ আপনি কিবলার দিকে মুখ করে আছেন':'ফোন ঘুরিয়ে 🕋 কে উপরের তীরের সামনে আনুন'}
const oh=e=>{let h=null;if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading;else if((e.type==='deviceorientationabsolute'||e.absolute)&&e.alpha!=null)h=(360-e.alpha)%360;if(h!=null){QH=h;qUpd()}};
function qListen(){if(QL)return;QL=true;addEventListener('deviceorientationabsolute',oh,true);addEventListener('deviceorientation',oh,true)}
async function qSensor(){try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')return toast('সেন্সরের অনুমতি দেওয়া হয়নি')}catch(e){return}qListen()}
function qStart(){qUpd();
 if(!QS){QS=true;
  if(!QB&&navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{const R=Math.PI/180,f1=p.coords.latitude*R,f2=21.4225*R,dl=(39.8262-p.coords.longitude)*R;QB=(Math.atan2(Math.sin(dl)*Math.cos(f2),Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))/R+360)%360;try{sessionStorage.setItem('qb',QB)}catch(e){}qUpd()},()=>{},{timeout:12000,maximumAge:36e5});
  qListen();setTimeout(()=>{const g=$('#qGo');if(QH==null&&g&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)g.hidden=false},1500);
  setTimeout(()=>{if(QH==null&&$('#qTxt'))$('#qTxt').textContent+=' · সেন্সর পাওয়া যায়নি, তাই শুধু ডিগ্রি দেখানো হচ্ছে'},4000)}
 else if(QL)qUpd()}
const qCard=()=>`<div class="qcard" id="qcard"><h3>🧭 কিবলা কম্পাস</h3><div class="qwrap"><div class="qptr"></div><div class="qdial" id="qdial"><span class="qn">উ</span><div class="qm"><span>🕋</span></div></div></div><p id="qTxt" class="muted" style="text-align:center;margin:6px 0">লোকেশন খোঁজা হচ্ছে…</p><button class="btn" id="qGo" hidden style="display:block;margin:0 auto">কম্পাস চালু করুন</button></div>`;
/* ---- লাইব্রেরি ---- */
const LINKS={1:'https://sunnah.com/',2:'https://hisnmuslim.com/',3:'https://www.islamhouse.com/bn/'};
document.addEventListener('click',e=>{const b=e.target.closest('[data-library],[data-feat]');if(!b)return;
 const k=b.dataset.feat||({0:'q'})[b.dataset.library];
 if(k==='q'){e.stopImmediatePropagation();quran('bn')}else if(k==='tj'){e.stopImmediatePropagation();quran('tj')}else if(k==='qb'){e.stopImmediatePropagation();setPage('prayer')}
 else if(b.dataset.library in LINKS){e.stopImmediatePropagation();open('<h2>বাইরের নির্ভরযোগ্য উৎস</h2><p class="muted">এই বিষয়বস্তু বাংলা সহ নির্ভরযোগ্য ওয়েবসাইটে আছে।</p><div class="modal-actions"><a class="btn" target="_blank" rel="noopener" href="'+LINKS[b.dataset.library]+'">ওয়েবসাইট খুলুন ↗</a></div>')}},true);
/* ---- থিম (লাইট/ডার্ক/অটো), বড় লেখা, ঘড়ি: সাইডবারে ---- */
const G=k=>{try{return localStorage.getItem(k)}catch(e){return null}},W=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const MQ=matchMedia('(prefers-color-scheme: dark)');const getPref=()=>{const t=G('theme');return t==='light'||t==='auto'?t:'dark'};const resolveTheme=()=>{const t=getPref();return t==='auto'?(MQ.matches?'dark':'light'):t};const ap=()=>{const t=getPref(),r=document.documentElement,rt=resolveTheme();r.setAttribute('data-theme',rt);const mc=document.querySelector('meta[name=theme-color]');if(mc)mc.content=rt==='light'?'#0b6b4f':(r.dataset.mtheme==='neon'?'#050a24':'#00170e');document.body.classList.toggle('big',G('bg')==='1');$$('[data-th]').forEach(x=>x.classList.toggle('on',x.dataset.th===t));const bb=$('#bgBtn');if(bb)bb.classList.toggle('on',G('bg')==='1')};window._applyMode=ap;window._getPref=getPref;window._resolveTheme=resolveTheme;const onMQ=()=>{if(getPref()==='auto'){ap();render()}};MQ.addEventListener?MQ.addEventListener('change',onMQ):MQ.addListener&&MQ.addListener(onMQ);
$('.sidebar-foot').insertAdjacentHTML('beforebegin','<div class="prefs"><b>দেখার ধরন</b><div class="seg"><button data-th="light">☀ লাইট</button><button data-th="dark">☾ ডার্ক</button><button data-th="auto">অটো</button></div><div class="seg"><button id="bgBtn">A+ বড় লেখা</button><span id="clkSlot" style="flex:1;display:flex"></span></div></div>');
const ck=$('#clockBtn');if(ck)$('#clkSlot').appendChild(ck);
$$('[data-th]').forEach(x=>x.onclick=()=>{W('theme',x.dataset.th);ap();render()});$('#bgBtn').onclick=()=>{W('bg',G('bg')==='1'?'0':'1');ap()};ap();
/* ---- লাইব্রেরি পেজে নতুন কার্ড ---- */
const _r=render;render=function(){_r();if(page==='prayer'){const g=$('#content .page-grid');if(g&&!$('#qcard')){g.insertAdjacentHTML('afterend',qCard());const q=$('#qGo');if(q)q.onclick=qSensor;qStart()}}if(page==='library'){const g=$('#content .page-grid');if(g&&!$('[data-feat]'))g.insertAdjacentHTML('beforeend',['tj|🎨|রঙিন তাজবিদ কুরআন|তাজবিদের নিয়ম রঙে চেনা|কুরআন খুলুন','qb|🧭|কিবলা কম্পাস|কাবার দিক দেখুন|কম্পাস খুলুন'].map(x=>{x=x.split('|');return `<div class="page-card library-card"><div class="book-icon">${x[1]}</div><div><h3>${x[2]}</h3><p>${x[3]}</p><button class="btn secondary small" data-feat="${x[0]}">${x[4]}</button></div></div>`}).join(''))}};render()
})();

/* ===== extras.js ===== */
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

/* ===== হোম, থিম, AI ===== */
/* ===== নতুন হোম পেজ (মকআপের ডিজাইন) — আগের সব ফিচার অপরিবর্তিত ===== */
(function(){
const NM=['ফজর','যোহর','আসর','মাগরিব','এশা'],IC=['🌅','☀️','🌤️','🌇','🌙'],b2=n=>Number(n).toLocaleString('bn-BD',{minimumIntegerDigits:2,useGrouping:false});
const tm=k=>(k==='যোহর'&&new Date().getDay()===5?db.prayer.জুমা:db.prayer[k])||'';
function nextP(){const now=new Date(),L=NM.map(k=>{const[h,m]=tm(k).split(':').map(Number),d=new Date(now);d.setHours(h,m,0,0);return{k,n:k==='যোহর'&&now.getDay()===5?'জুমা':k,d}}).filter(x=>!isNaN(x.d));
 return L.find(x=>x.d>now)||(L[0]&&{...L[0],d:new Date(L[0].d.getTime()+864e5)})}
function hj(){try{return new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}
const homeGreen=function(){
 const don=sum(db.donations,'amount'),goal=db.settings.goal||1,pct=Math.min(100,Math.round(don/goal*100)),n=db.notices.slice().reverse()[0],fri=new Date().getDay()===5;
 const tiles=[['committee','🕌','মসজিদ<br>পরিচিতি'],['library','📖','কুরআন ও<br>শিক্ষা'],['donations','🤲','দান ও<br>সদকা'],['community','👥','কমিউনিটি<br>ও সেবা'],['notices','📢','ঘোষণা ও<br>নোটিশ'],['accounts','📈','আয়-ব্যয়<br>হিসাব']];
 const chips=[['events','▦ ইভেন্ট ও মাহফিল'],['gallery','🖼️ ছবি ও ভিডিও'],['archive','🗂 পুরোনো হিসাব'],['blood','🩸 রক্তদাতা']];
 const tchips=`<button class="m-chip" data-theme>🎨 থিম</button><button class="m-chip" data-ai>✨ AI সহকারী</button>`;
 return `<div class="mh"><header class="m-hero"><svg class="m-moon" viewBox="0 0 50 50"><path d="M33 4a22 22 0 1 0 13 30A17 17 0 0 1 33 4z" fill="#fff6c8"/></svg>
 <div class="m-top"><div class="m-brand"><div class="m-logo">🕌</div><div><h1>গোপীনাথপুর <em>জামে মসজিদ</em></h1><p>শান্তি · ইবাদত · সেবা</p></div></div></div>
 <div class="m-tools"><button class="m-bell" data-go="notices" aria-label="নোটিশ">🔔<b>${Number(db.notices.length).toLocaleString('bn-BD')}</b></button></div>
 <div class="m-quote">“নিশ্চয়ই আল্লাহর স্মরণেই অন্তর প্রশান্তি পায়।”<span>— কুরআন ১৩:২৮</span><i></i></div></header>
 <section class="m-row1"><div class="m-glass m-date"><span class="ic">📅</span><div><b>${esc(new Intl.DateTimeFormat('bn-BD',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date()))}</b><small>${esc(hj())}</small></div></div>
 <div class="m-glass m-next"><span class="ic">🕌</span><div><small>পরবর্তী নামাজ</small><strong id="mNm">—</strong><time id="mCd">০০:০০:০০</time></div></div></section>
 <section class="m-prayers">${NM.map((k,i)=>`<div class="m-pr" data-k="${k}" data-go="prayer"><span class="pi">${IC[i]}</span><b>${k==='যোহর'&&fri?'জুমা':k}</b><span class="t">${esc(tm(k))}</span></div>`).join('')}</section>
 <section class="m-tiles">${tiles.map(t=>`<button class="m-tile" data-go="${t[0]}"><i>${t[1]}</i>${t[2]}</button>`).join('')}</section>
 <div class="m-chips">${tchips}${chips.map(c=>`<button class="m-chip" data-go="${c[0]}">${c[1]}</button>`).join('')}</div>
 <section class="m-glass m-notice"><div class="ic">📢</div><div style="flex:1;min-width:0"><h3>সর্বশেষ নোটিশ <a data-go="notices">সব দেখুন ›</a></h3><p>${n?esc(n.title):'এখনো কোনো ঘোষণা নেই'}</p><small>${n?'📅 '+esc(n.date):''}</small></div></section>
 <section class="m-glass m-donate"><div class="k">🕋</div><div class="m"><b>মসজিদ উন্নয়নে সহযোগিতা করুন</b><div class="c">জমা: ${money(don)} / ${money(goal)}</div><div class="m-bar"><i style="width:${pct}%"></i></div><span class="m-pc">${Number(pct).toLocaleString('bn-BD')}%</span></div><button class="m-gold" data-go="donations">❤ এখনই<br>দান করুন</button></section></div>`};
/* ===== থিম বদল (সবুজ / নিয়ন) ===== */
const THEMES={green:['🟢 সবুজ-সোনালি','আগের ডিজাইন'],neon:['🔵 নিয়ন নীল','রাতের আকাশ, নীল-বেগুনি-সবুজ আলো']};
const curTheme=()=>document.documentElement.dataset.mtheme==='neon'?'neon':'green';
const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';
const homeLight=home;
function setTheme(t){try{localStorage.gm_mtheme=t}catch(e){}document.documentElement.dataset.mtheme=t;
 if(window._applyMode)window._applyMode();render()}
function setMode(m){try{localStorage.setItem('theme',m)}catch(e){}if(window._applyMode)window._applyMode();render()}
function themeSheet(){const c=curTheme();
 const pm=window._getPref?window._getPref():'dark';$('#modalBody').innerHTML=`<h2>🎨 থিম বেছে নিন</h2><div class="th-mode"><b>দেখার ধরন</b><div class="seg">${[['light','☀ লাইট'],['dark','☾ ডার্ক'],['auto','অটো']].map(x=>`<button class="${pm===x[0]?'on':''}" data-mode="${x[0]}">${x[1]}</button>`).join('')}</div></div><div class="th-grid">${Object.keys(THEMES).map(k=>`<button class="th-card ${k} ${c===k?'on':''}" data-pick="${k}"><span class="th-sw"><i></i><i></i><i></i></span><b>${THEMES[k][0]}</b><small>${THEMES[k][1]}</small>${c===k?'<em>✓ চালু আছে</em>':''}</button>`).join('')}</div><p class="muted" style="font-size:13px">সবুজ-সোনালি ও নিয়ন নীল থিম ডার্ক মোডে দেখা যায়। পছন্দ এই ফোনে সেভ থাকবে।</p><p class="muted" style="font-size:11px;text-align:center;margin-top:6px">থিম সিস্টেম ভার্সন ১৫</p>`;
 $('#modalBackdrop').classList.add('show')}
/* ===== হিসাবের ডাটা ও AI ===== */
const bnn=n=>Number(n).toLocaleString('bn-BD'),dstr=d=>d.toISOString().slice(0,10);
function txAll(){return[...db.donations.map(x=>({...x,kind:'আয়',isDon:1})),...db.accounts]}
function range(p,off=0){const n=new Date(),y=n.getFullYear(),m=n.getMonth();let a,b;
 if(p==='m'){a=new Date(y,m-off,1);b=new Date(y,m-off+1,0)}
 else if(p==='lm'){a=new Date(y,m-1-off,1);b=new Date(y,m-off,0)}
 else if(p==='y'){a=new Date(y-off,0,1);b=new Date(y-off,11,31)}
 else if(p==='d30'){b=new Date(n.getTime()-off*30*864e5);a=new Date(b.getTime()-29*864e5)}
 else return null;
 return[dstr(a),dstr(new Date(b.getFullYear(),b.getMonth(),b.getDate()))]}
const inR=(x,r)=>!r||((x.date||'')>=r[0]&&(x.date||'')<=r[1]);
function sumP(p,off=0){const r=range(p,off),L=txAll().filter(x=>inR(x,r)),S=f=>L.filter(f).reduce((s,x)=>s+Number(x.amount||0),0);
 const inc=S(x=>x.kind==='আয়'),out=S(x=>x.kind==='ব্যয়'),don=S(x=>x.isDon);
 const top=k=>{const o={};L.filter(x=>x.kind===k).forEach(x=>o[x.category||'অন্যান্য']=(o[x.category||'অন্যান্য']||0)+Number(x.amount||0));return Object.entries(o).sort((a,b)=>b[1]-a[1])};
 return{inc,out,don,bal:inc-out,n:L.length,topInc:top('আয়'),topOut:top('ব্যয়'),L}}
const PN={m:'এই মাসে',lm:'গত মাসে',d30:'গত ৩০ দিনে',y:'এই বছরে',all:'এ পর্যন্ত'};
const pct=(c,p)=>p?Math.round((c-p)/p*100):null;
const arrow=v=>v===null?'—':(v>=0?'↑ ':'↓ ')+bnn(Math.abs(v))+'%';
function insights(){const c=sumP('m'),l=sumP('lm'),o=[];
 if(!c.n&&!l.n)return['এখনো কোনো হিসাব যোগ হয়নি। আয়-ব্যয় লিখলে এখানে স্বয়ংক্রিয় বিশ্লেষণ আসবে।'];
 o.push(`এই মাসে আয় ${money(c.inc)}, ব্যয় ${money(c.out)}; ${c.bal>=0?'উদ্বৃত্ত':'ঘাটতি'} ${money(Math.abs(c.bal))}।`);
 const gi=pct(c.inc,l.inc),go=pct(c.out,l.out);
 if(gi!==null)o.push(`আয় গত মাসের চেয়ে ${bnn(Math.abs(gi))}% ${gi>=0?'বেশি':'কম'}।`);
 if(go!==null)o.push(`ব্যয় গত মাসের চেয়ে ${bnn(Math.abs(go))}% ${go>=0?'বেশি':'কম'}${go>20?' — খরচের দিকে নজর দিন':''}।`);
 if(c.topOut[0])o.push(`সবচেয়ে বড় ব্যয়ের খাত: ${c.topOut[0][0]} (${money(c.topOut[0][1])})।`);
 if(c.topInc[0])o.push(`সবচেয়ে বড় আয়ের উৎস: ${c.topInc[0][0]} (${money(c.topInc[0][1])})।`);
 const g=db.settings.goal||0,d=sum(db.donations,'amount');if(g)o.push(`দানের লক্ষ্যের ${bnn(Math.min(100,Math.round(d/g*100)))}% পূর্ণ হয়েছে।`);
 if(c.bal<0)o.push('পরামর্শ: ঘাটতি পূরণে জুমার দান বা বিশেষ আবেদন চালু করা যায়।');
 return o}
function localAsk(q){q=q.trim();const p=/গত\s*মাস/.test(q)?'lm':/বছর/.test(q)?'y':/৩০|30/.test(q)?'d30':/এই\s*মাস|মাসে/.test(q)?'m':'all',s=sumP(p),w=PN[p];
 if(/নামাজ|ওয়াক্ত|আজান|জামাত/.test(q)){const x=nextP();return x?`পরবর্তী নামাজ ${x.n}, সময় ${tm(x.k)}। আজকের সময়: `+NM.map(k=>k+' '+tm(k)).join(', ')+'।':'নামাজের সময় সেট করা নেই।'}
 if(/নোটিশ|ঘোষণা/.test(q)){const n=db.notices.slice().reverse()[0];return n?`সর্বশেষ নোটিশ: ${n.title} (${n.date})`:'এখনো কোনো নোটিশ নেই।'}
 if(/লক্ষ্য|লক্ষ|অগ্রগতি/.test(q)){const g=db.settings.goal||0,d=sum(db.donations,'amount');return g?`দানের লক্ষ্য ${money(g)}, জমা ${money(d)} (${bnn(Math.min(100,Math.round(d/g*100)))}%)।`:'লক্ষ্যমাত্রা সেট করা নেই।'}
 if(/খাত|সবচেয়ে/.test(q)){const k=/আয়|দান/.test(q)?s.topInc:s.topOut;return k.length?w+' শীর্ষ খাত: '+k.slice(0,3).map(x=>x[0]+' '+money(x[1])).join(', ')+'।':'এই সময়ে কোনো তথ্য নেই।'}
 if(/উদ্বৃত্ত|ব্যালেন্স|জমা|বাকি|হাতে/.test(q))return `${w} উদ্বৃত্ত ${money(s.bal)} (আয় ${money(s.inc)} − ব্যয় ${money(s.out)})।`;
 if(/ব্যয়|খরচ|খরচা/.test(q))return `${w} মোট ব্যয় ${money(s.out)}, ${bnn(s.L.filter(x=>x.kind==='ব্যয়').length)}টি লেনদেন।`;
 if(/দান|অনুদান|চাঁদা/.test(q))return `${w} দান ${money(s.don)}${/আয়/.test(q)?`, মোট আয় ${money(s.inc)}`:''}।`;
 if(/আয়/.test(q))return `${w} মোট আয় ${money(s.inc)}।`;
 if(/সারাংশ|বিশ্লেষণ|পরামর্শ|রিপোর্ট|প্রতিবেদন/.test(q))return insights().join(' ');
 return 'আমি আয়, ব্যয়, উদ্বৃত্ত, দান, নামাজের সময়, নোটিশ ও দানের লক্ষ্য নিয়ে বলতে পারি। যেমন: “গত মাসে কত খরচ হয়েছে?”'}
async function aiAsk(q){const u=(db.settings.aiUrl||'').trim();
 if(u){try{const c=sumP('m'),l=sumP('lm'),ctx={মসজিদ:'গোপীনাথপুর জামে মসজিদ',এই_মাস:{আয়:c.inc,ব্যয়:c.out,উদ্বৃত্ত:c.bal,দান:c.don,শীর্ষ_ব্যয়:c.topOut.slice(0,3),শীর্ষ_আয়:c.topInc.slice(0,3)},গত_মাস:{আয়:l.inc,ব্যয়:l.out},দানের_লক্ষ্য:db.settings.goal,মোট_দান:sum(db.donations,'amount'),নামাজ:db.prayer,সর্বশেষ_নোটিশ:(db.notices.slice().reverse()[0]||{}).title};
  const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:q,context:ctx})});const j=await r.json();if(j.answer)return{t:j.answer,ai:1}}catch(e){}}
 return{t:localAsk(q),ai:0}}
function aiSheet(){
 $('#modalBody').innerHTML=`<h2>✨ AI সহকারী</h2><div class="ai-box">${insights().map(x=>`<p>• ${esc(x)}</p>`).join('')}</div>
 <div class="ai-chips">${['এই মাসে কত খরচ?','গত মাসে আয় কত?','উদ্বৃত্ত কত?','পরবর্তী নামাজ কখন?','কোন খাতে বেশি খরচ?'].map(x=>`<button class="ai-chip">${x}</button>`).join('')}</div>
 <div id="aiLog" class="ai-log"></div><div class="ai-row"><input id="aiQ" placeholder="প্রশ্ন লিখুন, যেমন: এই বছরে দান কত?"><button class="btn" id="aiGo">পাঠান</button></div>
 <small class="muted" id="aiMode">${db.settings.aiUrl?'🟢 অনলাইন AI চালু':'⚪ অ্যাপের তথ্য থেকে হিসাব করা উত্তর (অনলাইন AI বন্ধ)'} · <a href="#" id="aiCfg" style="color:var(--green)">AI সেটিং</a></small>`;
 $('#modalBackdrop').classList.add('show');
 const log=$('#aiLog'),go=async q=>{q=q.trim();if(!q)return;log.insertAdjacentHTML('beforeend',`<div class="ai-me">${esc(q)}</div><div class="ai-bot" id="aiW">…</div>`);
  const r=await aiAsk(q);const w=$('#aiW');w.removeAttribute('id');w.textContent=r.t;log.scrollTop=log.scrollHeight;$('#aiQ').value=''};
 $('#aiGo').onclick=()=>go($('#aiQ').value);$('#aiQ').onkeydown=e=>{if(e.key==='Enter')go(e.target.value)};
 document.querySelectorAll('.ai-chip').forEach(b=>b.onclick=()=>go(b.textContent));
 $('#aiCfg').onclick=e=>{e.preventDefault();const v=prompt('অনলাইন AI-এর লিংক (Cloudflare Worker URL)। খালি রাখলে বন্ধ থাকবে:',db.settings.aiUrl||'');if(v===null)return;db.settings.aiUrl=v.trim();save();aiSheet();toast(v.trim()?'AI লিংক সেভ হয়েছে':'অনলাইন AI বন্ধ করা হয়েছে')}}
/* ===== নিয়ন হোম ===== */
let NP='m';
function series(kind,p,n=5){const r=range(p)||[(txAll().map(x=>x.date||'').sort()[0]||dstr(new Date())),dstr(new Date())],a=new Date(r[0]),b=new Date(r[1]),span=Math.max(1,(b-a)/864e5+1),out=Array(n).fill(0);
 txAll().forEach(x=>{if(!inR(x,r)||!x.date)return;const ok=kind==='inc'?x.kind==='আয়':kind==='out'?x.kind==='ব্যয়':kind==='don'?x.isDon:1;if(!ok)return;const i=Math.min(n-1,Math.floor((new Date(x.date)-a)/864e5/span*n));out[i]+=Number(x.amount||0)});return out}
const bars=a=>{const m=Math.max(...a,0);return a.map(v=>`<i style="height:${m>0?Math.max(18,Math.round(v/m*100)):18}%"></i>`).join('')};
function chart(p){const yr=p==='y',N=yr?12:30,r=range(p)||range('d30'),a=new Date(r[0]),inc=Array(N).fill(0),out=Array(N).fill(0);
 txAll().forEach(x=>{if(!inR(x,r)||!x.date)return;const d=new Date(x.date),i=yr?d.getMonth():Math.min(N-1,Math.round((d-a)/864e5));(x.kind==='আয়'?inc:out)[i]+=Number(x.amount||0)});
 const mx=Math.max(...inc,...out,1),W=320,H=110,X=i=>8+i*(W-16)/(N-1),Y=v=>H-8-v/mx*(H-24);
 const pts=arr=>arr.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
 const lab=yr?['জানু','মার্চ','মে','জুলাই','সেপ্টে','নভে']:['১','৭','১৪','২১','৩০'];
 const grid=[0,.5,1].map(f=>`<line x1="8" x2="${W-8}" y1="${(Y(mx*f)).toFixed(1)}" y2="${(Y(mx*f)).toFixed(1)}" stroke="#ffffff18"/>`).join('');
 return `<svg viewBox="0 0 ${W} ${H+18}" class="n-svg"><defs><linearGradient id="ng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#19e6c1" stop-opacity=".75"/><stop offset="1" stop-color="#19e6c1" stop-opacity=".05"/></linearGradient></defs>${grid}
 <polygon points="${X(0)},${H-8} ${pts(inc)} ${X(N-1)},${H-8}" fill="url(#ng)"/><polyline points="${pts(inc)}" fill="none" stroke="#19e6c1" stroke-width="2.2" stroke-linejoin="round"/>
 <polyline points="${pts(out)}" fill="none" stroke="#b36bff" stroke-width="2" stroke-dasharray="4 3" stroke-linejoin="round"/>
 ${inc.map((v,i)=>v&&N<=12?`<circle cx="${X(i)}" cy="${Y(v)}" r="3" fill="#fff"/>`:'').join('')}
 ${lab.map((t,i)=>`<text x="${8+i*(W-16)/(lab.length-1)}" y="${H+12}" fill="#c9d3ff" font-size="9" text-anchor="${i?i==lab.length-1?'end':'middle':'start'}">${t}</text>`).join('')}</svg>
 <div class="n-leg"><span><i style="background:#19e6c1"></i>আয়</span><span><i style="background:#b36bff"></i>ব্যয়</span>${mx<=1?'<em>এখনো তথ্য নেই</em>':''}</div>`}
function homeNeon(){
 const p=NP,s=sumP(p),pv=range(p)?sumP(p,1):null,fri=new Date().getDay()===5;
 const cards=[['teal','🤲','মোট দান',s.don,pv&&pct(s.don,pv.don),series('don',p)],['purple','📈','মোট আয়',s.inc,pv&&pct(s.inc,pv.inc),series('inc',p)],['blue','🧾','মোট ব্যয়',s.out,pv&&pct(s.out,pv.out),series('out',p)],['gold','🪙','উদ্বৃত্ত',s.bal,pv&&pct(s.bal,pv.bal),series('inc',p).map((v,i)=>v-series('out',p)[i]).map(v=>Math.max(0,v))]];
 const cm=sumP('m'),lmm=sumP('lm'),gr=pct(cm.inc,lmm.inc);
 const stats=[['👥',db.members.length,'সদস্য'],['📢',db.notices.length,'নোটিশ'],['▦',db.events.length,'ইভেন্ট'],['🧾',txAll().length,'লেনদেন']];
 return `<div class="mh nh"><header class="n-hero"><div class="n-top"><div class="n-logo">🕌</div><div class="n-title"><h1>গোপীনাথপুর জামে মসজিদ</h1><p>ডিজিটাল ড্যাশবোর্ড</p><u></u></div>
 <button class="n-bell" data-go="notices" aria-label="নোটিশ">🔔<b></b></button><button class="n-avatar" data-go="admin" aria-label="অ্যাডমিন">A</button></div>
 <div class="n-row2"><div class="n-welcome"><small>আসসালামু আলাইকুম</small><b>প্রিয় মুসল্লি 👋</b></div>
 <label class="n-per">📅 <select id="nPer">${[['m','এই মাস'],['d30','গত ৩০ দিন'],['y','এই বছর'],['all','সব সময়']].map(o=>`<option value="${o[0]}" ${o[0]===NP?'selected':''}>${o[1]}</option>`).join('')}</select></label></div></header>
 <section class="n-stats">${cards.map(c=>`<div class="n-stat ${c[0]}"><span class="si">${c[1]}</span><div><small>${c[2]}</small><b>${money(c[3])}</b><em class="${c[4]!==null&&c[4]<0?'dn':''}">${c[4]===null||c[4]===undefined?'—':arrow(c[4])}</em></div><div class="mb">${bars(c[5])}</div></div>`).join('')}</section>
 <section class="n-card n-live"><div class="n-lh"><b>📊 লাইভ ওভারভিউ</b><span class="n-rt"><i></i>লাইভ</span></div>
 <div class="n-lm"><div class="n-up">↗</div><div><strong>${gr===null?'—':(gr>=0?'+':'−')+bnn(Math.abs(gr))+'%'}</strong><small>এই মাসে আয়ের প্রবৃদ্ধি</small></div><div class="n-orb"></div></div>
 <div class="n-np"><span>🕌 পরবর্তী নামাজ</span><b id="mNm">—</b><time id="mCd">০০:০০:০০</time></div>
 <div class="n-ms">${stats.map(x=>`<div><span>${x[0]}</span><b>${bnn(x[1])}</b><small>${x[2]}</small></div>`).join('')}</div></section>
 <section class="n-card"><div class="n-lh"><b>📈 আয়-ব্যয়ের পরিসংখ্যান</b><small class="muted">${NP==='y'?'মাস অনুযায়ী':'দিন অনুযায়ী'}</small></div>${chart(p)}</section>
 <section class="n-two"><div class="n-card"><div class="n-lh"><b>⭐ নামাজের সময়</b><button class="n-go" data-go="prayer" aria-label="সব দেখুন">›</button></div>
 ${NM.map((k,i)=>`<div class="n-pl" data-k="${k}"><em>${bnn(i+1)}.</em><span class="pi">${IC[i]}</span><b>${k==='যোহর'&&fri?'জুমা':k}</b><span class="n-pt t">${esc(tm(k))}</span></div>`).join('')}</div>
 <div class="n-card"><div class="n-lh"><b>⚡ কুইক অ্যাকশন</b></div><div class="n-qa"><button data-action="addDonation"><i>🤲</i>দান যোগ</button><button data-action="addNotice"><i>📢</i>নোটিশ দিন</button><button data-go="accounts"><i>📊</i>রিপোর্ট</button><button data-theme><i>🎨</i>থিম</button></div></div></section>
 <section class="n-card n-ai"><div class="n-lh"><b>✨ AI সহকারী</b><span class="n-rt"><i></i>স্মার্ট</span></div><p>${esc(insights()[0])}</p><div class="n-aib"><button class="n-btn" data-ai>বিশ্লেষণ দেখুন</button><button class="n-btn ghost" data-ai>প্রশ্ন করুন</button></div></section></div>`}
document.addEventListener('change',e=>{if(e.target.id==='nPer'){NP=e.target.value;render()}});
document.addEventListener('click',e=>{
 const _tb=e.target.closest('[data-theme]');if(_tb&&_tb!==document.documentElement){e.preventDefault();themeSheet();return}
 const _mb=e.target.closest('[data-mode]');if(_mb){setMode(_mb.dataset.mode);themeSheet();return}
 if(e.target.closest('[data-ai]')){e.preventDefault();aiSheet();return}
 const k=e.target.closest('[data-pick]');if(k){try{if(!isDark())localStorage.setItem('theme','dark')}catch(_){}setTheme(k.dataset.pick);typeof closeModal==='function'?closeModal():$('#modalBackdrop').classList.remove('show');toast(k.dataset.pick==='neon'?'নিয়ন থিম চালু':'সবুজ-সোনালি থিম চালু')}});
home=function(){return !isDark()?homeLight():(curTheme()==='neon'?homeNeon():homeGreen())};
{const sf=document.querySelector('.sidebar-foot');if(sf)sf.insertAdjacentHTML('beforebegin','<button class="nav-item" data-theme>🎨 <span>থিম পরিবর্তন</span></button><button class="nav-item" data-ai>✨ <span>AI সহকারী</span></button>')}
function tick(){const el=document.getElementById('mCd');if(!el)return;const x=nextP();if(!x)return;
 let s=Math.max(0,Math.floor((x.d-new Date())/1e3));el.textContent=b2(s/3600|0)+':'+b2(s%3600/60|0)+':'+b2(s%60);document.getElementById('mNm').textContent=x.n;
 document.querySelectorAll('.m-pr,.n-pl').forEach(c=>c.classList.toggle('on',c.dataset.k===x.k))}
const _r=render;render=function(){_r();document.body.classList.toggle('is-home',page==='home');tick()};
setInterval(tick,1000);render();
})();


/* ===== লাইব্রেরি v2: ফুল স্ক্রিন রিডার, একটাই কুরআন (তাজবিদ + উচ্চারণ + অনুবাদ), অ্যাপের ভেতরেই হাদিস/শিক্ষা ===== */
(function(){
const bnum=n=>Number(n).toLocaleString('bn-BD',{useGrouping:false});
const LS={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const getJ=u=>fetch(u).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
let fs=null;
/* --- ফুল স্ক্রিন পর্দা (ফোনের ব্যাক বাটনও কাজ করবে) --- */
function fsOpen(title,ext){
 if(fs)fs.remove();
 fs=document.createElement('div');fs.id='fsView';
 fs.innerHTML='<div class="fs-bar"><button class="fs-back" aria-label="ফিরে যান">←</button><b>'+esc(title)+'</b>'+(ext?'<a class="fs-ext" href="'+esc(ext)+'" target="_blank" rel="noopener" title="ব্রাউজারে খুলুন" aria-label="ব্রাউজারে খুলুন">↗</a>':'')+'</div><div class="fs-body"></div>';
 document.body.appendChild(fs);document.body.classList.add('fs-on');
 if(!(history.state&&history.state.fs))history.pushState({fs:1},'');
 fs.querySelector('.fs-back').onclick=()=>{history.state&&history.state.fs?history.back():fsClose()};
 return fs.querySelector('.fs-body')}
function fsClose(){if(fs){fs.remove();fs=null}document.body.classList.remove('fs-on')}
addEventListener('popstate',()=>{if(fs&&!(history.state&&history.state.fs))fsClose()});
/* --- বাইরের সাইট অ্যাপের ভেতরেই (মোবাইল ভার্সন) --- */
function openSite(title,url,noExt){
 const b=fsOpen(title,noExt?null:url);
 b.innerHTML='<div class="fs-load"><div class="fs-spin"></div><p>লোড হচ্ছে…</p></div><iframe src="'+esc(url)+'" title="'+esc(title)+'" allow="fullscreen; clipboard-write" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="fs-hint" hidden><span>পেজ না এলে ↗ চেপে ব্রাউজারে খুলুন</span><button aria-label="বন্ধ">✕</button></div>';
 const f=b.querySelector('iframe'),l=b.querySelector('.fs-load'),h=b.querySelector('.fs-hint');
 f.onload=()=>l.remove();
 h.querySelector('button').onclick=()=>h.remove();
 setTimeout(()=>{if(h.isConnected)h.hidden=false},6000)}
/* --- একীভূত কুরআন --- */
let SUR=null,BT,S={n:1,ay:[]};
const pref={tj:LS.g('q_tj')!=='0',tn:LS.g('q_tn')!=='0',tl:LS.g('q_tl')!=='0',fz:+LS.g('q_fz')||28};
const TJ=h=>h.replace(/<tajweed class=([a-z_]+)>/g,'<i class="tj $1">').replace(/<\/tajweed>/g,'</i>').replace(/<span class=end>[^<]*<\/span>/g,'').replace(/<(?!\/?i[ >])[^>]*>/g,'');
async function openQuran(){
 const b=fsOpen('কুরআন মাজিদ');
 b.innerHTML='<p class="muted" style="padding:20px">লোড হচ্ছে…</p>';
 try{SUR=SUR||(await getJ('https://api.alquran.cloud/v1/surah')).data}catch(e){
  b.innerHTML='<div class="notice-banner" style="margin:16px">ইন্টারনেট সংযোগ লাগবে। সংযোগ দিয়ে আবার চেষ্টা করুন।</div><button class="btn" id="qRetry" style="margin:0 16px">আবার চেষ্টা করুন</button>';
  b.querySelector('#qRetry').onclick=openQuran;return}
 const last=Math.min(114,Math.max(1,+LS.g('q_s')||1));
 b.innerHTML='<div class="qr" style="--qfz:'+pref.fz+'px"><div class="qr-ctl"><select id="qrS">'+SUR.map(s=>'<option value="'+s.number+'">'+bnum(s.number)+'. '+esc(s.name)+' ('+esc(s.englishName)+')</option>').join('')+'</select>'
 +'<div class="qr-opt"><label><input type="checkbox" id="qoTj"'+(pref.tj?' checked':'')+'> রঙিন তাজবিদ</label><label><input type="checkbox" id="qoTn"'+(pref.tn?' checked':'')+'> উচ্চারণ</label><label><input type="checkbox" id="qoTl"'+(pref.tl?' checked':'')+'> অনুবাদ</label><span class="qr-fz"><button id="qfM" aria-label="ছোট">A−</button><button id="qfP" aria-label="বড়">A+</button></span></div></div>'
 +'<div id="qrKey"></div><div id="qrBody"></div></div>';
 const sel=b.querySelector('#qrS');sel.value=last;
 sel.onchange=()=>loadSurah(+sel.value);
 const tog=(id,k,sv)=>{b.querySelector(id).onchange=e=>{pref[k]=e.target.checked;LS.s(sv,pref[k]?'1':'0');paint()}};
 tog('#qoTj','tj','q_tj');tog('#qoTn','tn','q_tn');tog('#qoTl','tl','q_tl');
 const fz=d=>{pref.fz=Math.min(46,Math.max(20,pref.fz+d));LS.s('q_fz',pref.fz);b.querySelector('.qr').style.setProperty('--qfz',pref.fz+'px')};
 b.querySelector('#qfM').onclick=()=>fz(-3);b.querySelector('#qfP').onclick=()=>fz(3);
 loadSurah(last)}
async function loadSurah(n){
 const body=$('#qrBody');if(!body)return;
 body.innerHTML='<p class="muted" style="padding:20px">লোড হচ্ছে…</p>';
 LS.s('q_s',n);
 const [t,e]=await Promise.allSettled([getJ('https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number='+n),getJ('https://api.alquran.cloud/v1/surah/'+n+'/editions/quran-uthmani,bn.bengali,en.transliteration')]);
 if(BT===undefined)BT=await getJ('quran-bn-translit.json').catch(()=>null);
 if(!$('#qrBody'))return;
 if(t.status!=='fulfilled'&&e.status!=='fulfilled'){body.innerHTML='<div class="notice-banner" style="margin:16px">সূরাটি লোড করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।</div>';return}
 const ed=e.status==='fulfilled'?e.value.data:null,tv=t.status==='fulfilled'?t.value.verses:null,len=(ed?ed[0].ayahs.length:tv.length);
 const bt=BT&&BT[n];
 S={n,bnTr:!!bt,ay:Array.from({length:len},(_,i)=>{
  let ar=ed?ed[0].ayahs[i].text:'';if(i===0&&n!==1&&n!==9&&ar.startsWith('بِسْمِ'))ar=ar.split(' ').slice(4).join(' ');
  let tn=bt?bt[i]:(ed&&ed[2]?ed[2].ayahs[i].text:'');if(!bt&&i===0&&n!==1&&/^bismi/i.test(tn))tn=tn.split(' ').slice(4).join(' ');
  return {ar,tj:tv&&tv[i]?TJ(tv[i].text_uthmani_tajweed):'',tn,tl:ed&&ed[1]?ed[1].ayahs[i].text:''}})};
 paint();const sc=body.closest('.fs-body');if(sc)sc.scrollTop=0}
function paint(){
 const body=$('#qrBody');if(!body||!S.ay.length)return;
 const n=S.n,hasTj=pref.tj&&S.ay.some(a=>a.tj);
 $('#qrKey').innerHTML=hasTj?'<div class="tj-key"><i class="tj ghunnah">গুন্নাহ</i><i class="tj ikhfa">ইখফা</i><i class="tj idgham_ghunnah">ইদগাম</i><i class="tj iqlab">ইকলাব</i><i class="tj qalqalah">কলকলা</i><i class="tj madda_normal">মাদ</i><i class="tj ham_wasl">ওয়াসল</i></div>':'';
 body.innerHTML=(n!==1&&n!==9?'<div class="qr-bis">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>':'')
 +S.ay.map((a,i)=>'<div class="ay"><div class="ay-n">'+bnum(i+1)+'</div><div class="ar">'+(hasTj&&a.tj?a.tj:esc(a.ar))+' ﴿'+bnum(i+1)+'﴾</div>'
  +(pref.tn&&a.tn?'<div class="ay-tn">'+esc(a.tn)+'</div>':'')+(pref.tl&&a.tl?'<p class="ay-tl">'+esc(a.tl)+'</p>':'')+'</div>').join('')
 +(pref.tn&&!S.bnTr?'<div class="qr-note">উচ্চারণ এখন ইংরেজি হরফে দেখানো হচ্ছে। বাংলা হরফের উচ্চারণ দিতে quran-bn-translit.json ফাইল যুক্ত করুন।</div>':'')
 +'<div class="qr-nav">'+(n>1?'<button class="btn secondary" data-qn="'+(n-1)+'">← আগের সূরা</button>':'<span></span>')+(n<114?'<button class="btn" data-qn="'+(n+1)+'">পরের সূরা →</button>':'<span></span>')+'</div>';
 body.querySelectorAll('[data-qn]').forEach(x=>x.onclick=()=>{const s=$('#qrS');s.value=x.dataset.qn;loadSurah(+x.dataset.qn)})}
/* --- লাইব্রেরি পেজ --- */
const SITES={h:['হাদিস','https://ihadis.com/'],d:['দৈনন্দিন দোয়া','https://hisnmuslim.com/'],n:['নামাজ শিক্ষা ও ইসলামিক বই','https://www.islamhouse.com/bn/']};
const ITEMS=[['q','📖','কুরআন মাজিদ','আরবি, বাংলা অনুবাদ ও তিলাওয়াত — অ্যাপের ভেতরেই','কুরআন পড়ুন'],['h','📚','হাদিস','হাদিসের বই — অ্যাপের ভেতরেই','হাদিস পড়ুন'],['d','🤲','দৈনন্দিন দোয়া','সকাল-সন্ধ্যা ও প্রয়োজনীয় দোয়া','দোয়া দেখুন'],['n','🕌','নামাজ শিক্ষা','ওজু, নামাজ ও প্রয়োজনীয় মাসআলা','শিখুন'],['t','📿','ডিজিটাল তাসবিহ','তাসবিহ গণনার সহজ কাউন্টার','তাসবিহ খুলুন']];
library=function(){
 const card=(k,ic,t,d,btn,feat)=>'<div class="page-card library-card"><div class="book-icon">'+ic+'</div><div><h3>'+t+'</h3><p>'+d+'</p><button class="btn secondary small" '+(feat?'data-feat="'+k+'"':'data-lib2="'+k+'"')+'>'+btn+'</button></div></div>';
 return '<div class="grid page-grid">'+ITEMS.map(x=>card(...x)).join('')+card('qb','🧭','কিবলা কম্পাস','কাবার দিক দেখুন','কম্পাস খুলুন',1)+'</div>'};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-lib2]');if(!b)return;
 e.stopImmediatePropagation();e.preventDefault();
 const k=b.dataset.lib2;
 if(k==='q')openSite('কুরআন মাজিদ','https://quran.com/bn',1);else if(k==='t')tasbih();else if(SITES[k])openSite(SITES[k][0],SITES[k][1])},true);
if(page==='library')render();
})();
