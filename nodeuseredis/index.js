esversion = 6;

const express = require('express');

var app = express();

app.use(express.json());

const redis = require('redis');
var sub = redis.createClient(), pub = redis.createClient();

app.get('/', function (req, res) {
    var msg = req.body.message;
    console.log("TCL: msg", msg)
    pub.publish("get Channel", msg);
    res.status(200).json({
        success: true,
    });
});

app.listen(3000);

sub.on("message", function (channel, message) {
    console.log(channel,":",message);
});

sub.subscribe("get Channel");


// Proper shutdown

process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('clean');
        sub.unsubscribe();
        sub.quit();
        pub.quit();
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something, when app is closing
process.on("exit", exitHandler.bind(null, {cleanup:true}));

// catches ctrl + c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));