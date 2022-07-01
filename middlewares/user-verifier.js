const setCookie = require('set-cookie-parser')
const { verifyToken } = require('@utils')

module.exports = async (req, res, next) => {
    const splitCookieHeaders = setCookie.splitCookiesString(
        req.headers['cookie']
    )
    const cookies = setCookie.parse(splitCookieHeaders)
    cookies.map(c => {
        if(c.name === 'ably-token') {
            const tokens = JSON.parse(c.value)
            req.user = verifyToken(tokens.access_token)
            req.user.refresh_token = tokens.refresh_token
        }
    })

    if(req.user) {
        next()
    } else {
        res.status(401).json({
            message: 'not authorized.'
        })
    }    
}
 
 

