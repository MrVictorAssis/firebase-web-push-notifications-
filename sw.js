const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting()) //passa para a função de activate
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {

  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('message', function(event){
  
})

function showNotification(event){
  //que retorna a promise que vai montar as notifications
  return new Promise(resolve => {
    // const { body, title, tag } = JSON.parse(event.data.text());
    const notification = JSON.parse(event.data.text());
    console.log(notification)
    self.registration
        .getNotifications({ })
        .then(existingNotifications = {})
        .then(() => {
          return self.registration
                .showNotification(  notification.notification.title,//title
                {
                    body: notification.notification.body,//corpo da mensagem
                    data: notification.notification.click_action,//link do click
                    tag: 'push-notification-tag',
                    icon: notification.notification.icon,//icone da notificação
                    requireInteraction: true//precisa fechar pra sair
                  })
        })
        .then(resolve)
  })
}
//O firebase dispara esse evento ao retornar com os dados da notificação
self.addEventListener("push", event =>{
  //passamos esses dados para essa function
  event.waitUntil(showNotification(event));
})

self.addEventListener("notificationclick", event=> {
  event.waitUntil(clients.openWindow(event.notification.data));
})
