/* RAIM 네컷 PWA 서비스 워커
   - 앱 셸(html/css/js/아이콘) 사전 캐시 → 오프라인에서도 앱 로드
   - 동일 출처 에셋(로봇 이미지 등): 캐시 우선
   - 외부 CDN(폰트/MediaPipe/Supabase/QR): stale-while-revalidate
   - 업로드(POST)·AI 호출은 캐싱하지 않음(GET만 처리)
   캐시를 갱신하려면 VERSION 값을 올리세요. */
const VERSION = "raim-v5";
const SHELL   = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await cache.addAll(SHELL_ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;            // 업로드/AI(POST) 등은 그대로 통과
  const url = new URL(req.url);

  // 1) 페이지 네비게이션: 네트워크 우선, 실패 시 캐시된 index.html
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try { return await fetch(req); }
      catch { return (await caches.match("./index.html")) || Response.error(); }
    })());
    return;
  }

  // 2) 동일 출처 정적 에셋: 캐시 우선 + 백그라운드 저장
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const net = await fetch(req);
        if (net && net.ok) { const c = await caches.open(RUNTIME); c.put(req, net.clone()); }
        return net;
      } catch { return cached || Response.error(); }
    })());
    return;
  }

  // 3) 외부 CDN: stale-while-revalidate
  e.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(req);
    const fetchP = fetch(req).then(net => {
      if (net && (net.ok || net.type === "opaque")) cache.put(req, net.clone());
      return net;
    }).catch(() => null);
    return cached || (await fetchP) || Response.error();
  })());
});
