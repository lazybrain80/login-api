const request = require('request')
 
const verifyUser = req => {
    return new Promise(function (resolve, reject) {
        resolve(true)
    })
}
 
module.exports = async (req, res, next) => {
    const result = await verifyUser(req)
    if (!result) {
        res.status(401).send({})
    } 
    
    next()
}
 
 

