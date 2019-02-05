const http = require('http');
const fs = require('fs');
const url = require('url');
const { execSync } = require('child_process');
const readline = require('readline');

const hostname = '0.0.0.0';
const port = 4000;

const p = '\\[%{DATE_EU:timestamp}\\] %{WORD:url} %{INT:status_code} %{INT:bytes} %{INT:servetime} %{WORD:first}'

function image (path) {
    return fs.readFileSync(path)
}

// parse logdata line by line and contribute to result
async function logdata(date, result, callback) {
    execSync(`grep -h ${date} /home/am/logdata/2019-07/rcsear_webgui-access.log.1 > /home/am/logdata/2019-07/date.log`);
    var lr = readline.createInterface({
        input: fs.createReadStream('/home/am/logdata/2019-07/date.log')
    });
    lr.on('line', function (line) {
        obj = line.split(/[\s,]+/)
        obj[0] = obj[0].replace('[', '')
        if (result[obj[0]]) {
            let tmp = result[obj[0]];
            tmp.duration += parseInt(obj[5]);
            tmp.times += 1;
            result[obj[0]] = tmp
        } else {
            result[obj[0]] = {duration:parseInt(obj[5]), times:1}
        }
    });
    lr.on('close', function () {
        callback(result);
    });
}

const server = http.createServer((req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    if (query.image) {
        var data = image('/home/am/logdata/'+query.image);
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(data);
    } else if (query.date) {
        logdata(query.date, {}, (data) => {
            for (var key in data) {
                data[key].duration = data[key].duration / data[key].times / 1000
            }
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(data));
        })
    } else  {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end()
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});