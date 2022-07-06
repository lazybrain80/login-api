'use strict'

const express = require('express')
const router = express()

router.use('/signin', require('./signin'))
router.use('/user', require('./user'))
router.use('/phone', require('./phone'))
 

module.exports = router