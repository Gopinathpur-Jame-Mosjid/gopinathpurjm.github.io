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
const ap=()=>{const t=G('theme')||'auto',r=document.documentElement;t==='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',t);document.body.classList.toggle('big',G('bg')==='1');$$('[data-th]').forEach(x=>x.classList.toggle('on',x.dataset.th===t));const bb=$('#bgBtn');if(bb)bb.classList.toggle('on',G('bg')==='1')};
$('.sidebar-foot').insertAdjacentHTML('beforebegin','<div class="prefs"><b>দেখার ধরন</b><div class="seg"><button data-th="light">☀ লাইট</button><button data-th="dark">☾ ডার্ক</button><button data-th="auto">অটো</button></div><div class="seg"><button id="bgBtn">A+ বড় লেখা</button><span id="clkSlot" style="flex:1;display:flex"></span></div></div>');
const ck=$('#clockBtn');if(ck)$('#clkSlot').appendChild(ck);
$$('[data-th]').forEach(x=>x.onclick=()=>{W('theme',x.dataset.th);ap()});$('#bgBtn').onclick=()=>{W('bg',G('bg')==='1'?'0':'1');ap()};ap();
/* ---- লাইব্রেরি পেজে নতুন কার্ড ---- */
const _r=render;render=function(){_r();if(page==='prayer'){const g=$('#content .page-grid');if(g&&!$('#qcard')){g.insertAdjacentHTML('afterend',qCard());const q=$('#qGo');if(q)q.onclick=qSensor;qStart()}}if(page==='library'){const g=$('#content .page-grid');if(g&&!$('[data-feat]'))g.insertAdjacentHTML('beforeend',['tj|🎨|রঙিন তাজবিদ কুরআন|তাজবিদের নিয়ম রঙে চেনা|কুরআন খুলুন','qb|🧭|কিবলা কম্পাস|কাবার দিক দেখুন|কম্পাস খুলুন'].map(x=>{x=x.split('|');return `<div class="page-card library-card"><div class="book-icon">${x[1]}</div><div><h3>${x[2]}</h3><p>${x[3]}</p><button class="btn secondary small" data-feat="${x[0]}">${x[4]}</button></div></div>`}).join(''))}};render()
})();
