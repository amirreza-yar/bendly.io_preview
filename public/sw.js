// const CACHE_NAME = "bendly-v1";

// const urlsToCache = [
//   "/",
//   "/manifest.json",
//   "/images/icon-192x192.png",
//   "/images/icon-512x512.png",
// ];

// self.addEventListener("install", (event) => {
//   console.log("SW installed");

//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     }),
//   );

//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   console.log("SW activated");

//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys.map((key) => {
//           if (key !== CACHE_NAME) {
//             return caches.delete(key);
//           }
//         }),
//       ),
//     ),
//   );

//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return fetch(event.request)
//         .then((networkResponse) => {
//           return caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, networkResponse.clone());

//             return networkResponse;
//           });
//         })
//         .catch(() => {
//           return caches.match("/");
//         });
//     }),
//   );
// });

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("<https://demigod.click>"));
});
