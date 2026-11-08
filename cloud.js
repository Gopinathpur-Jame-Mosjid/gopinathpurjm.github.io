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
 return `<div class="notice-banner">লগইন: <b>${esc(me.email)}</b> (${role==='owner'?'মালিক':'অ্যাডমিন'})</div><div class="grid page-grid">${K('🕌 নামাজের সময়','দৈনিক নামাজ ও ইকামতের সময় হালনাগাদ করুন।','<button class="btn" data-action="editPrayer">সময় সম্পাদনা</button>')}${K('📢 ঘোষণা','নতুন নোটিশ প্রকাশ করুন।','<button class="btn" data-action="addNotice">ঘোষণা প্রকাশ</button>')}${K('💰 অনুদানের লক্ষ্য','ফান্ডের লক্ষ্য নির্ধারণ করুন।','<button class="btn" data-action="goal">লক্ষ্যমাত্রা সেট</button>')}${K('📲 পেমেন্ট তথ্য','বিকাশ, নগদ ও ব্যাংকের তথ্য।','<button class="btn" data-action="payment">তথ্য সম্পাদনা</button>')}${K('🗂 পুরোনো হিসাব','খাতার PDF যোগ করুন।','<button class="btn" data-go="archive">আর্কাইভে যান</button>')}${K('▣ QR পোস্টার','দেয়ালে লাগানোর জন্য প্রিন্ট করুন।','<a class="btn secondary" href="qr.html" target="_blank" style="text-decoration:none;display:inline-block">QR তৈরি করুন</a>')}${role==='owner'?K('👥 অ্যাডমিন ব্যবস্থাপনা','অ্যাডমিন যোগ, চালু/বন্ধ ও মুছুন।','<button class="btn" data-go="team">ব্যবস্থাপনা</button>'):''}${K('📄 ব্যাকআপ','সব তথ্য JSON ফাইলে নামান।','<button class="btn secondary" data-action="backup">ব্যাকআপ</button>')}${K('🚪 লগআউট','এই ডিভাইস থেকে বের হন।','<button class="btn danger" data-logout>লগআউট</button>')}</div>`;}
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
