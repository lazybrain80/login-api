const setCookie = require('set-cookie-parser')
const { verifyToken } = require('@utils')

module.exports = async (req, res, next) => {
    const splitCookieHeaders = setCookie.splitCookiesString(
        req.headers['cookie']
    )
    const cookies = setCookie.parse(splitCookieHeaders)
    cookies.map(c => {
        if(c.name === 'regist-token') {
            req.registToken = verifyToken(c.value)
        }
    })

    if(req.registToken) {
        next()
    } else {
        res.status(401).json({
            message: 'not authorized.'
        })
    }    
}
 
 

