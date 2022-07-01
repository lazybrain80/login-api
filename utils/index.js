const util = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
    const buf = await randomBytesPromise(64)
    return buf.toString("base64")
}


exports.validation = (type, value) => {
    if (type === 'password') {
        return /^(?=.*[^a-zA-Z0-9가-힣]).{6,}$/.test(value)
    }
 
    if (type === 'email') {
        return /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(value)
    }

    if (type === 'phone') {
        return /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(value)
    }
}

exports.generateToken = (payload) => {
    return jwt.sign(payload, __config.system.tokenSecret, {
        expiresIn: "3m",
    })
}

exports.generateUserToken = (payload) => {
    return jwt.sign(payload, __config.system.tokenSecret, {
        expiresIn: "15m",
    })
}

exports.generateRefreshToken = () => {
    return jwt.sign({}, __config.system.tokenRefreshSecret, {
        expiresIn: "7d",
    })
}

exports.verifyToken = (token) => {
    return decoded = jwt.verify(token,  __config.system.tokenSecret);
}

exports.verifyRefreshToken = (token) => {
    return decoded = jwt.verify(token,  __config.system.tokenRefreshSecret);
}

exports.createPassword = async (password) => {
    const salt = await createSalt();
    const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
    const hashedPassword = key.toString("base64");
  
    return { hashedPassword, salt }
}

exports.verifyPassword = async (password, userSalt, userPassword) => {
    const key = await pbkdf2Promise(password, userSalt, 104906, 64, "sha512")
    const hashedPassword = key.toString("base64")
  
    if (hashedPassword === userPassword) {
        return true
    }

    return false
}