const express = require('express')
const api = express.Router()

const { userCntrl } = require('@controllers')
const { userVerifier, registVerifier } = require('@middlewares')
const { generateToken } = require('@utils')


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
        res.cookie('user-token', JSON.stringify(refreshedToken), {
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

// 로그인 후 비밀번호 변경
api.post('/password', userVerifier, async (req, res) => {
    try {
        res.status(200).json(await userCntrl.changePassword(req.user, req.body))
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//회원 탈퇴
api.delete('/', userVerifier, async (req, res) => {
    try {
        await userCntrl.withdraw(req.user, req.body)
        res.cookie('user-token', JSON.stringify({}), {
            maxAge: 0,
            path: '/',
            encode: String,
            httpOnly: true
        })
        res.status(200).json({})
    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = api