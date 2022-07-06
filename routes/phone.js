const express = require('express')
const api = express.Router()

const { phoneCntrl } = require('@controllers')

//1. 전화번호 인증 요청
api.post('/', async (req, res) => {
   
    try {
        await phoneCntrl.reqestAuthCode(req.body)
        res.status(200).json({
            'message': '전화번호 인증을 요청했습니다.'
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
})

// 인증코드 확인
api.post('/veri', async (req, res) => {
   
    try {
        const result = await phoneCntrl.verifyPhone(req.body)
        const registToken = generateToken({
            phone: result.phone,
            name: result.name
        })

        res.cookie('phone-auth-token', registToken, {
            maxAge: 180000, //3분
            path: '/',
            encode: String,
            httpOnly: true
        })

        res.status(200).json({
            'phone-auth-token': registToken
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = api