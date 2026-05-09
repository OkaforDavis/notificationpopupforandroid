/**
 * Service Worker for Android Notifications
 * Handles background notifications and notification events
 */

const CACHE_NAME = 'notification-system-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/notification.js',
    '/android-notification.js',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache).catch((err) => {
                console.log('Cache addAll error:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
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
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Return offline page if needed
                return new Response('Offline - Service Worker');
            });
        })
    );
});

// Notification click event - handle notification interaction
self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const data = notification.data || {};

    notification.close();

    // Focus the window if already open
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );

    // Call any custom click handler
    if (data.onClickUrl) {
        // Navigate to specified URL
    }
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag);
});

// Message event - handle messages from client
self.addEventListener('message', (event) => {
    const { type, tag } = event.data;

    if (type === 'CLOSE_NOTIFICATION') {
        // Close specific notification
        self.registration.getNotifications({ tag }).then((notifications) => {
            notifications.forEach((notification) => {
                notification.close();
            });
        });
    } else if (type === 'CLOSE_ALL_NOTIFICATIONS') {
        // Close all notifications
        self.registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => {
                notification.close();
            });
        });
    }
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notifications') {
        event.waitUntil(
            // Process any pending notifications
            Promise.resolve()
        );
    }
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', (event) => {
        if (event.tag === 'check-notifications') {
            event.waitUntil(
                // Check for pending notifications
                Promise.resolve()
            );
        }
    });
}

console.log('Service Worker loaded and ready for notifications');
