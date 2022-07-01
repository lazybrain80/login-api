const express = require('express')
const api = express.Router()

const { userCntrl } = require('@controllers')
const { userVerifier, registVerifier } = require('@middlewares')
const { generateToken } = require('@utils')

//1. 전화번호 인증
api.post('/phone', async (req, res) => {
   
    try {
        const result = await userCntrl.verifyPhone(req.body)
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

        res.status(200).json(result)

    } catch (error) {
        res.status(400).json(error.message)
    }
})

//2. 회원 가입
api.post('/', registVerifier, async (req, res) => {
   
    try {
        res.send((await userCntrl.register(req.body, req.registToken)))

    } catch (error) {
        res.status(400).json(error.message)
    }
})

// get logined user-info
api.get('/:userId', userVerifier, async (req, res) => {
    try {
        res.status(200).json(await userCntrl.userInfo(req.params.userId, req.user))
    } catch (error) {
        res.status(400).json(error.message)
    }
})

// refresh access-token
api.get('/:userId/token/refresh', userVerifier, async (req, res) => {
    try {

        const refreshedToken = await userCntrl.refreshToken(req.user)
        res.cookie('ably-token', JSON.stringify(refreshedToken), {
            maxAge: 900000, // 15분
            path: '/',
            encode: String,
            httpOnly: true
        })

        res.status(200).json(refreshedToken)

    } catch (error) {
        res.status(400).json(error.message)
    }
})

// 로그인 하지 않고 전화번호 인증 후 비밀번호 재설정
api.delete('/password', registVerifier, async (req, res) => {
    try {
        res.status(200).json(await userCntrl.resetPassword(req.registToken))
    } catch (error) {
        res.status(400).json(error.message)
    }
})


// //회원 탈퇴
// api.delete('/', async (req, res) => {
// })

module.exports = api