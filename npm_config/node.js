process.env.NODE_CONFIG_ENV = "development"
process.env.NODE_APP_INSTANCE = "app"

const config = require('config');

console.log("testUrl:",config.get('testUrl'));
console.log("default:",config.get('default')); 
console.log("default-app:",config.get('default-app'));
console.log("development:",config.get('development'));
console.log("development-app:",config.get('development-app'));
