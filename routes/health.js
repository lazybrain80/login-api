const express = require('express')
const router = express()

router.get('/', async (req, res) => {
    res.sendStatus(200)
})

module.exports = router
