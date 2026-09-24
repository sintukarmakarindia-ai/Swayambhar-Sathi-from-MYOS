// Version update kora hoyeche (v2). Vobissote update korle eta v3, v4 korben.
const CACHE_NAME = "swayambhar-sathi-pwa-v3";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./splash.jpg",
    "./logoleft.jpg",
    "./logomiddle.jpg",
    "./logoright.jpg",
    "./icon-192.png",
    "./icon-512.png"
];

/* =========================
   INSTALL
========================= */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );
    // Notun version ke wait na koriye sate sate install korbe
    self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Purono version er cache delete korbe
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Notun cache take control nite sahajyo korbe
    self.clients.claim();
});

/* =========================
   FETCH (NETWORK-FIRST STRATEGY)
========================= */
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Internet thakle notun data anbe abong cache e update korbe
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Offline e ba network fail korle cache theke data nibe
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Offline e onyo page khujle index.html e niye asbe
                    if (event.request.mode === 'navigate') {
                        return caches.match("./index.html");
                    }
                });
            })
    );
});
