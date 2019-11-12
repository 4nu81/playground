require('dotenv').config()

const express = require('express');
const webpush = require('web-push');

const pubVapidKey = process.env.PUBLIC_VAPID_KEY;
const privVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails('mailto:a.nubi.am@googlemail.com', pubVapidKey, privVapidKey);

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(__dirname+'/public'));

app.post('/subscribe', (req, res) => {
    const subscribtion = req.body;
    res.status(201).json({
        success: true
    });
    const payload = JSON.stringify({title: 'successful subscribed'});

    console.log(subscribtion);

    webpush.sendNotification(subscribtion, payload).catch(err => {
        console.error(err.stack);
    });
});

app.get('/', (req, res) => {
    res.render('index', {});
})

app.listen(3000, () => {
    console.log("server runs on port 3k")
});