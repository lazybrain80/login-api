const express = require('express')
const api = express.Router()
const { userCntrl } = require('@controllers')
 
api.post('/', async (req, res) => {
    try {
        
        const { email, phone, username, password } = req.body

        let result = null
        if(email && password) {
            result = await userCntrl.verifyWithEmail(email, password)
        } else if ( phone && username && password) {
            result = await userCntrl.verifyWithPhone(phone, username, password)
        } else {
            throw new Error('로그인에 필요한 정보를 찾을 수 없습니다.')
        }

        if (!result.verified) {
            res.status(401).json({})
        } else {
            const signedToken = await userCntrl.signinToken(result.user)

            res.cookie('ably-token', JSON.stringify(signedToken), {
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
 
 

