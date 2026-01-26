/**
 * Basic Service Worker for PWA Installability
 */
self.addEventListener('install', (event) => {
  // Force new SW to take control immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Minimal passthrough for now.
  // In Phase 19+, we can add caching strategies.
  // This satisfies the PWA requirement for a fetch handler.
  event.respondWith(fetch(event.request));
});
