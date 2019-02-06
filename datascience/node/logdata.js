const fs = require('fs');
const moment = require('moment');
const { execSync } = require('child_process');
const readline = require('readline');
const date = require('./date');

var ignore = ['favicon', 'apple', 'static', 'css']

// parse logdata line by line and contribute to result
async function logdata(date, result, callback) {
    var unixDate = Date.parse(date);
    execSync(`grep -h ${moment(unixDate).format('DD/MMM/YYYY')} /home/am/logdata/2019-07/rcsear_webgui-access.log* > /home/am/logdata/2019-07/date.log`);
    var lr = readline.createInterface({input: fs.createReadStream('/home/am/logdata/2019-07/date.log')});
    lr.on('line', function (line) {
        for (item of ignore) {
            if (line.includes(item)) { continue }
        }
        obj = line.split(/[\s,]+/)
        obj[0] = obj[0].replace('[', '')

        format = 'dd/NNN/yyyy:HH:mm:ss'
        date = Date.parseString(obj[0], format)
        if (date instanceof Date && !isNaN(date)){
            obj[0] = moment(date).format('YYYY-MM-DD HH:00')
            if (result[obj[0]]) {
                let tmp = result[obj[0]];
                tmp.duration += parseInt(obj[5]) / 1000;
                tmp.times += 1;
                tmp.max = (parseInt(obj[5]) / 1000 > tmp.max ? parseInt(obj[5]) / 1000 : tmp.max)
                result[obj[0]] = tmp
            } else {
                result[obj[0]] = {duration:parseInt(obj[5]), times:1, max:parseInt(obj[5])}
            }
        }
    });
    lr.on('close', function () {
        callback(result);
    });
}

exports.logdata = logdata;