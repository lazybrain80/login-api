const { 
    validation
} = require('@utils')

const mobileRequires = mobileInfo => {
    const {phone, name} = mobileInfo
    if(!validation('phone', phone)) {
        throw new Error('핸드폰 번호 형식에 맞지 않습니다.')
    }

    if(name === '' || name === null || name === undefined) {
        throw new Error('전화번호 인증을 위한 이름이 필요합니다.')
    }

    return {
        phone,
        name,
    }
}
 
exports.reqestAuthCode = async (mobileInfo) => {

    const veriInfo = mobileRequires(mobileInfo)

    __cache.del(`${veriInfo.name}:${veriInfo.phone}`);

    //const verifyCode = Array(6).fill().map(() => Math.random() * 10)
    const verifyCode = "123456789"

    // await __sms.messages
    //     .create({
    //         body: `[인증번호]: ${randomCode}`,
    //         from: __config.twilio.from,
    //         to: veriInfo.phone
    //     })
    
    __cache.put(`${veriInfo.name}:${veriInfo.phone}`, verifyCode, 180000)
}


exports.verifyPhone = async (authInfo) => {

    const {phone, name, code} = authInfo
    
    if(__cache.get(`${name}:${phone}`) === code) {
        const foundUser = await __db.USER.findOne({
            where: {
                phone: phone,
                username: name,
            }
        })
    
        if(foundUser) {
            return __db.USER.update(
                {
                    phone_verified: true,
                },
                {
                    where: {
                        phone:foundUser.phone,
                        username: foundUser.username
                    }
                }
            )
            .then(() => {
                return {
                    phone: foundUser.phone,
                    name: foundUser.username
                }
            })
        } 
    
        return __db.USER.create({
            email: '',
            phone: veriInfo.phone,
            phone_verified: true,
            password: '',
            nickname: '',
            username: veriInfo.name,
            register_done: false,
            salt: ''
        }).then(newUser => {
            return {
                phone: newUser.phone,
                name: newUser.username
            }
        })
    }
}