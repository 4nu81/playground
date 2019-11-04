const fs = require('fs');

const file = './storage.json';

function getUsers () {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
module.exports.getUsers = getUsers;

function setUsers (users) {
    fs.writeFileSync(file, JSON.stringify(users));
}
module.exports.setUsers = setUsers;