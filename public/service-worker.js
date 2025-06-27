const CACHE_NAME = 'dicoding-story-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/favicon.png',
  '/logo.png',
  '/manifest.json',
  '/placeholder.png',
  '/src/styles/main.css',
  '/src/main.js',
  '/marker-icon-2x.png',
  '/marker-icon.png',
  '/marker-shadow.png',
  '/layers-2x.png',
  '/layers.png',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama jika ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

// Fetch: cache first, fallback ke network, fallback pesan offline jika gagal
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Hanya handle request dari origin sendiri
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Fallback khusus untuk gambar
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match('/placeholder.png'))
        );
      })
    );
    return;
  }

  // Fallback untuk selain gambar
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return (
        response ||
        fetch(event.request).catch(
          () =>
            new Response(
              `<h2 style="text-align:center;margin-top:2rem;">Kamu sedang offline.<br>Konten tidak tersedia.</h2>`,
              { headers: { 'Content-Type': 'text/html' } }
            )
        )
      );
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  let notificationData = {};
  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'Dicoding Story',
      options: {
        body: event.data ? event.data.text() : 'Ada notifikasi baru',
        icon: '/favicon.png',
        badge: '/favicon.png',
      },
    };
  }

  const title = notificationData.title || 'Dicoding Story';
  const options = notificationData.options || {
    body: 'Ada notifikasi baru',
    icon: '/favicon.png',
    badge: '/favicon.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = '/#/';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
