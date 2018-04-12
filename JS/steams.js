const fs = require('fs')
const highland = require('highland')
highland(fs.createReadStream('./customer.csv'))
    .each(x => console.log('each', x))
