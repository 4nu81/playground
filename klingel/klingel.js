const express = require('express');
const path = require('path');
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails('mailto:a.nubi.am@googlemail.com', publicVapidKey, privateVapidKey);

const port = process.argv[2] || 4000;

var app = express()

app.post('/subscribe', (req, res) => {
    const subsciption = {
        endpoint: "https://www.rcs.de",
        expirationTime: null,
        keys: {
            auth: "",
            p256dh: ""
        }
    }
    res.status(201).json({'hey':'there'});
    const payload = JSON.stringify({ title: 'klingel'});

    console.log(subsciption);

    webpush.sendNotification(
        subsciption,
        payload
    ).catch(err => {
        console.error(err.stack);
    });
});
app.get('/hey', (req, res) => {
    res.json({'hey':'there'});
    webpush.payload_send({
        message: JSON.stringify({
            title: 'klingel',
            message: "hey there",
            url: "https:www.google.com",
        }),
        endpoint: endpoint
    })
})
app.use(require('express-static')('./'));
app.listen(port);