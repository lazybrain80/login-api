const express = require('express')
const api = express.Router()
const setCookie = require('set-cookie-parser')

const { userCntrl } = require('@controllers')
const { userVerifier } = require('@middlewares')
const { generateToken, verifyToken } = require('@utils')

//1. 전화번호 인증
api.post('/phone', async (req, res) => {
   
    try {
        const result = await userCntrl.verifyPhone(req.body)
        const registToken = generateToken({
            phone: result.phone,
            name: result.name
        })

        res.cookie('regist-token', registToken, {
            maxAge: 180000, //3분
            path: '/',
            encode: String,
            httpOnly: true
        })

        res.status(200)

    } catch (error) {
        res.status(400).json(error.message)
    }
    _insert_log(req, req)
})

//2. 회원 가입
api.post('/', async (req, res) => {
   
    try {
        const splitCookieHeaders = setCookie.splitCookiesString(
            req.headers['set-cookie']
        )
        const cookies = setCookie.parse(splitCookieHeaders)
        cookies.map(c => {
            if(c.name === 'regist-token') {
                const decodedTok = verifyToken(c.value)
                res.send(await userCntrl.register(req.body, decodedTok))
            }
        })

        res.status(401).json({
            message: 'not authorized.'
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
    _insert_log(req, req)
})




//회원 탈퇴
api.delete('/', async (req, res) => {
})
