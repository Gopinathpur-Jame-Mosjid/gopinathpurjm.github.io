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
/* ---- কিবলা কম্পাস ---- */
function qibla(){
 open('<h2>🧭 কিবলা কম্পাস</h2><div class="cp"><div class="kb">🕋</div><div class="nd" id="nd"></div></div><p id="cpT" class="muted" style="text-align:center">লোকেশনের অনুমতি দিন</p><div class="modal-actions"><button class="btn" id="cpGo">চালু করুন</button></div>');
 $('#cpGo').onclick=()=>{
  if(!navigator.geolocation)return toast('লোকেশন সমর্থিত নয়');
  navigator.geolocation.getCurrentPosition(async p=>{
   const R=Math.PI/180,f1=p.coords.latitude*R,f2=21.4225*R,dl=(39.8262-p.coords.longitude)*R;
   const B=(Math.atan2(Math.sin(dl)*Math.cos(f2),Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))/R+360)%360;
   $('#cpT').textContent='কিবলা: উত্তর থেকে '+bn(Math.round(B))+'° (ঘড়ির কাঁটার দিকে)';$('#nd').style.transform='rotate('+B+'deg)';
   try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')return}catch(e){return}
   const on=e=>{const h=e.webkitCompassHeading!=null?e.webkitCompassHeading:(e.alpha!=null?360-e.alpha:null);if(h==null)return;const n=$('#nd');if(!n)return removeEventListener('deviceorientationabsolute',on);n.style.transform='rotate('+(B-h)+'deg)';$('#cpT').textContent='তীর ঘুরিয়ে কাবার দিকে মিলান · '+bn(Math.round(B))+'°'};
   addEventListener('deviceorientationabsolute',on,true);addEventListener('deviceorientation',on,true)},
  ()=>toast('লোকেশনের অনুমতি পাওয়া যায়নি'),{enableHighAccuracy:true})}}
/* ---- লাইব্রেরি ---- */
const LINKS={1:'https://sunnah.com/',2:'https://hisnmuslim.com/',3:'https://www.islamhouse.com/bn/'};
document.addEventListener('click',e=>{const b=e.target.closest('[data-library],[data-feat]');if(!b)return;
 const k=b.dataset.feat||({0:'q'})[b.dataset.library];
 if(k==='q'){e.stopImmediatePropagation();quran('bn')}else if(k==='tj'){e.stopImmediatePropagation();quran('tj')}else if(k==='qb'){e.stopImmediatePropagation();qibla()}
 else if(b.dataset.library in LINKS){e.stopImmediatePropagation();open('<h2>বাইরের নির্ভরযোগ্য উৎস</h2><p class="muted">এই বিষয়বস্তু বাংলা সহ নির্ভরযোগ্য ওয়েবসাইটে আছে।</p><div class="modal-actions"><a class="btn" target="_blank" rel="noopener" href="'+LINKS[b.dataset.library]+'">ওয়েবসাইট খুলুন ↗</a></div>')}},true);
/* ---- ডার্ক মোড ও বড় লেখা ---- */
const L=k=>{try{return localStorage.getItem(k)==='1'}catch(e){return false}},S=(k,v)=>{try{localStorage.setItem(k,v?'1':'0')}catch(e){}};
const ap=()=>{document.body.classList.toggle('dark',L('dk'));document.body.classList.toggle('big',L('bg'))};ap();
const ta=$('.top-actions');
ta.insertAdjacentHTML('afterbegin','<button class="icon-btn" id="dkBtn" title="ডার্ক মোড">◐</button><button class="icon-btn" id="bgBtn" title="বড় লেখা">A+</button>');
$('#dkBtn').onclick=()=>{S('dk',!L('dk'));ap()};$('#bgBtn').onclick=()=>{S('bg',!L('bg'));ap()};
/* ---- লাইব্রেরি পেজে নতুন কার্ড ---- */
const _r=render;render=function(){_r();if(page==='library'){const g=$('#content .page-grid');if(g&&!$('[data-feat]'))g.insertAdjacentHTML('beforeend',['tj|🎨|রঙিন তাজবিদ কুরআন|তাজবিদের নিয়ম রঙে চেনা|কুরআন খুলুন','qb|🧭|কিবলা কম্পাস|কাবার দিক দেখুন|কম্পাস খুলুন'].map(x=>{x=x.split('|');return `<div class="page-card library-card"><div class="book-icon">${x[1]}</div><div><h3>${x[2]}</h3><p>${x[3]}</p><button class="btn secondary small" data-feat="${x[0]}">${x[4]}</button></div></div>`}).join(''))}};render()
})();
