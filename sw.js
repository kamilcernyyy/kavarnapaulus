/* Paulus Coffee service worker: static files cache-first, page network-first with offline fallback. Video never intercepted. */
const V='paulus-v3', CORE=['/','/manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('.mp4')||r.headers.has('range'))return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('/',c));return res}).catch(()=>caches.match('/')));return}
  if(/\.[0-9a-f]{8}\.(js|woff2|avif|webp|jpg|png|svg)$/.test(u.pathname)||/^\/icon-/.test(u.pathname)){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})))}});
