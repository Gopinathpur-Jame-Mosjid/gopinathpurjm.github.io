// Firebase push (সেটআপ না থাকলে নীরবে বাদ যায়)
try{self.window=self;importScripts('firebase-config.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
if(self.FIREBASE_CONFIG&&!/^YOUR_/.test(self.FIREBASE_CONFIG.apiKey)){firebase.initializeApp(self.FIREBASE_CONFIG);firebase.messaging()}}catch(e){}
const CACHE='gopinathpur-masjid-v6';
const ASSETS=['./','./index.html','./style.css','./app.js','./premium.js','./cloud.js','./firebase-config.js','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/archive/'))return; // Firebase/Google অনুরোধ কখনো ক্যাশ হবে না
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
