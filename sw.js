self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('push', event => {
    // Agar server se push aaye to handle karo
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    // Notification click karne par website kholo
    event.waitUntil(
        clients.openWindow('/')
    );
});
