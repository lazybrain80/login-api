const { validation, createPassword } = require('@utils')
 
const vaildPassword = (password, checkPassword) => {
    if (!validation('password', password)) {
        throw new Error(
            '비밀번호는 특수문자를 포함한 6자리 이상으로 생성해 주세요.'
        )
    }
 
    if (password != checkPassword) {
        throw new Error('재확인 비밀번호가 일치하지 않습니다.')
    }
}

const regist_requires = registInfo => {
    const { email, nickname, password, checkPassword } = registInfo

    if ( !password || password === '' || !checkPassword || checkPassword === '' ) {
        throw new Error('password 항목이 반드시 필요합니다.')
    }

    vaildPassword(registInfo.password, registInfo.checkPassword)
 
    if (!email) {
        throw new Error('email 항목은 반드시 필요합니다.')
    }

    if(!validation('email', email)) {
        throw new Error('email 형식에 맞지 않습니다.')
    }
 
    if ( !nickname ) {
        nickname = ''
    }    
 
    return {
        email,
        nickname,
        password
    }
}
 

exports.register = (registInfo, mobileInfo) => {
    const veriInfo = regist_requires(registInfo)
    const { phone, name } = mobileInfo
 
    return __db.USER
        .findOne({
            phone: phone,
            username: name,
            phone_verified: true,
        })
        .then(found => {

            const { hashedPassword, salt } = createPassword(veriInfo.password)
            return __db.USER.update(
                {
                    phone: found.phone,
                },
                {
                    where: {
                        email: veriInfo.email,
                        password: veriInfo.password,
                        nickname: veriInfo.nickname,
                        register_done: true,
                        password: hashedPassword,
                        salt: salt
                    }
                }
            )
            .then(() => {
                return {
                    phone: veriInfo.phone,
                    name: veriInfo.name
                }
            })
        })
        .catch(e => {
            if (e.response.status == 409) {
                throw new Error(e.response.data.errorMessage)
            } else {
                throw new Error(e.message)
            }
        })
}


const mobile_requires = mobileInfo => {
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
 
exports.verifyPhone = async (mobileInfo) => {

    const veriInfo = mobile_requires(mobileInfo)
    
    const foundUser = await __db.USER.findOne({
        where: {
            phone: veriInfo.phone,
        }
    })

    if(foundUser) {
        if(foundUser.phone_verified 
            && foundUser.register_done) {
            throw new Error('이미 등록 완료된 전화번호 입니다.')
        }

        //TODO: 사용자 핸드폰 인증
        //

        return __db.USER.update(
            {
                phone: veriInfo.phone,
            },
            {
                where: {
                    phone_verified: true,
                    username: veriInfo.name
                }
            }
        )
        .then(() => {
            return {
                phone: veriInfo.phone,
                name: veriInfo.name
            }
        })
    } 

    return __db.USER.create({
        email: '',
        phone: veriInfo.phone,
        phone_verified: false,
        password: '',
        nickname: '',
        username: '',
        register_done: false,
        salt: ''
    }).then(async newUser => {

        //TODO: 사용자 핸드폰 인증
        //
        
        return __db.USER.update(
            {
                phone: newUser.phone,
            },
            {
                where: {
                    phone_verified: true,
                    username: veriInfo.name,
                }
            }
        )
        .then(() => {
            return {
                phone: veriInfo.phone,
                name: veriInfo.name
            }
        })
    })

    
}

