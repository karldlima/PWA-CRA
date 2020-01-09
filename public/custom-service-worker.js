importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const bgSyncPlugin = new workbox.backgroundSync.Plugin('todoQueue', {
  maxRetentionTime: 24 * 60
});

workbox.routing.registerRoute(
  'http://localhost:8000/todos',
  workbox.strategies.networkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

workbox.routing.registerRoute(/\.(?:js|css|html)$/, workbox.strategies.networkFirst());

workbox.routing.registerRoute('http://localhost:3000', workbox.strategies.networkFirst());

workbox.routing.registerRoute('http://localhost:8000/todos', workbox.strategies.networkFirst());

self.addEventListener('fetch', function(event) {
  console.log('fetch hit');
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
