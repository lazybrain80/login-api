'use strict'
 
global.__config = require('config')
global.__logger = console.log
global.__db = require('@models')
global.__sms = require('twilio')(__config.twilio.sid, __config.twilio.token)
global.__cache = require('memory-cache')
/* 자주 쓰는 library */
global._ = require('lodash')

 

