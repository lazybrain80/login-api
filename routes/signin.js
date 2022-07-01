const express = require('express')
const api = express.Router()
const { userCntrl } = require('@controllers')
 
api.post('/', async (req, res) => {
    try {
        
        ['email', 'password'].forEach(k => {
            if (!(k in req.body)) throw new Error(k + ' is required.')
        })

        const { email, password } = req.body

        const result = await userCntrl.verify(email, password)
        if (!result.verified) {
            res.status(401).json({})
        } else {
            const signedToken = await userCntrl.signinToken(result.user)

            res.cookie('ably-token', signedToken, {
                maxAge: 900000, // 15분
                path: '/',
                encode: String,
                httpOnly: true
            })

            res.status(200).json(signedToken)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
})
 
module.exports = api
 
 

