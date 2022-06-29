'use strict'
 
require('module-alias/register')
require('./global')
const app = require('./app')
 
const server = app.listen(__config.system.port, function () {
    // __logger("application start " + __config.system.port);
})
 
process.on('unhandledRejection', reason => {
    __logger('Unhandled Rejection at: Promise')
    __logger(reason)
})
 
server.on('listening', () => {
    __logger(
        'application started on http://%s:%d',
        '0.0.0.0',
        __config.system.port
    )
})
 
module.exports = server
 
 

