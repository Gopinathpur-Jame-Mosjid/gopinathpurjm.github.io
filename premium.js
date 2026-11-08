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
 const hd=$('.hero');if(hd&&!$('.mihrab')){hd.insertAdjacentHTML('beforeend',`<div class="mihrab"><small>পরবর্তী ওয়াক্ত</small><b>${nx.name}</b><div class="cd" id="nxCd"></div><small>${bd(nx.d.getHours()%12||12)}:${bd(nx.d.getMinutes())} মিনিটে</small></div>`)}
 $$('.prayer-card').forEach(c=>{const on=c.querySelector('span').textContent===nx.key;c.classList.toggle('next',on);c.querySelector('em').textContent=on?'পরবর্তী ওয়াক্ত':'নামাজের সময়'});tick()}
window._dress=dress;const _r=render;render=function(){_r();dress()};
$('#dock').onclick=e=>{const b=e.target.closest('button');if(!b)return;b.dataset.page?setPage(b.dataset.page):$('#sidebar').classList.toggle('open')};
let dp=null;const ib=$('#installBtn'),ios=/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches;
if(ios)ib.hidden=false;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;ib.hidden=false});
addEventListener('appinstalled',()=>{ib.hidden=true;toast('অ্যাপ ইনস্টল হয়েছে')});
ib.onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;ib.hidden=true}else if(ios)toast('Safari-র Share বোতাম → “Add to Home Screen” চাপুন')};
setInterval(tick,1000);dress();
})();
