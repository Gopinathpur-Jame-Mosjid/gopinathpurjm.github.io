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
