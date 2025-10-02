// Service Worker for PWA functionality
const CACHE_NAME = 'flux-enterprise-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/projects',
  '/workspace',
  '/analytics',
  '/integrations',
  '/marketplace',
  '/timeline',
  '/settings',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/manifest-icon-192.maskable.png',
    badge: '/icons/badge-72x72.png',
    tag: 'flux-notification',
    actions: [
      {
        action: 'open',
        title: 'Open FLUX',
        icon: '/icons/open-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('FLUX Enterprise', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync data when connection is restored
  return fetch('/api/sync')
    .then(response => response.json())
    .then(data => {
      console.log('Background sync completed:', data);
    })
    .catch(error => {
      console.error('Background sync failed:', error);
    });
}