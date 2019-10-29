var express = require('express');
var app = express();

var storage = {
    data:[]
};

app.use(express.json());
app.use(express.urlencoded());

app.get('/', function (req, res) {
    res.json(storage);
});

app.post('/', function (req, res) {
    var data = req.body;
    data.date = Date.now();
    storage.data.push(data);
    res.json({
        success: true,
        data: data
    });
});

app.delete('/', function (req, res){
    storage.data = [];
    res.json({
        success: true,
        data: storage
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});