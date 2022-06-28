'use strict'
const express = require('express')
const app = express()
 
app.use(express.json())
    .use('/v1', require('./routes/index'))

app.all('*', function (_, res) {
    res.status(404).send('<h1> 요청 페이지 없음 </h1>')
})

app.on('error', async (_, res) => {
    try {
        let m = res.message || 'api error'
        __logger.error(
            '%s,%s,%s,%s',
            res.host,
            res.method,
            res._matchedRoute,
            m
        )
        __logger.stack_error(res)
    } catch (erro) {}
})
 
module.exports = app
 
 

