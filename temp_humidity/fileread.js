var fs = require('fs');

const file = "storage.txt"

function addVal(val) {
    fs.appendFileSync(file, JSON.stringify(val)+'\n');
}

function readVals(filter={}) {
    var storage = {
        dates: []
    };
    var rawVals = fs.readFileSync(file, 'utf8');
    for (val of rawVals.split('\n')) {
        if (val) {
            storage.dates.push(JSON.parse(val));
        };
    }
    return storage;
}

function clearVals() {
    fs.writeFileSync(file, '');
}
module.exports.addVal = addVal;
module.exports.readVals = readVals;
module.exports.clearVals = clearVals;