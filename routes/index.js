'use strict'

const express = require('express')
const router = express()

router.use('/signin', require('./signin'))
router.use('/user', require('./user'))
 

module.exports = router