const publicVapidKey = 'BDkbbUg3Bdnw7rd_rwhy6NBuZOiubnvqVL1wtHh9X4tiSNNKEGAMaA9TIE3eFrhPVHikdF2QZdO09KdDFQ9LYS8'

if ('serviceWorker' in navigator){
    console.log('Registering service worker');
    run().catch(error => console.log(error));
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function run() {
    console.log('Registering service worker');
    const registration = await navigator.serviceWorker.
        register('/worker.js', {scope: '/'});
    console.log('service Worker Registered');

    console.log('register push');
    const subscription = await registration.pushManager.
        subscribe({
            endpoint: "http:/localhost:4000/",
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
    console.log('push registered');

    console.log('sending push');
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json'
        }
    });
    console.log('push sended')
}