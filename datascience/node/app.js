const express = require('express');
const { logdata } = require('./logdata');

const port = process.argv[2] || 4000;

const app = express()
var path = require('path')

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/js/apex.js', function(req,res) {
    res.sendFile(path.resolve('js','apex.js'));
});
app.get('/css/style.css', function(req,res) {
    res.sendFile(path.resolve('css','style.css'));
});

app.get('/get', function(req,res) {
    if (req.query.date) {
        logdata(req.query.date, {}, (data) => {
            for (var key in data) {
                data[key].duration = data[key].duration / data[key].times 
            }
            res.json(data);
        });
    } else {
        res.json({});
    }
});

app.listen(port);