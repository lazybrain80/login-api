const express = require('express')
const api = express.Router({ mergeParams: true })
const request = require('request')

 
api.post('/', async (req, res) => {
    try {
        ;['email', 'username', 'password'].forEach(k => {
            if (!(k in req.body)) throw new Error(k + ' is required.')
        })

        const { clientId, username, password } = req.body

    } catch (error) {
        res.status(400).json(error.message)
    }
})
 
module.exports = api
 
 

