const { 
    validation, 
    createPassword, 
    verifyPassword,
    generateUserToken,
    generateRefreshToken,
} = require('@utils')

const { v4: uuidv4 } = require('uuid')
 
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

const registRequires = registInfo => {
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
 

exports.register = async (registInfo, mobileInfo) => {
    const veriInfo = registRequires(registInfo)
    const { phone, name } = mobileInfo

    const foundUser = await __db.USER.findOne({
        where: {
            phone: phone,
            username: name,
            phone_verified: true,
        }
    })

    if (!foundUser) {
        throw new Error('요청하신 사용자는 전화번호를 미인증 하셨습니다.')
    }

    const { hashedPassword, salt } = await createPassword(veriInfo.password)
    const userId = uuidv4()
    return __db.USER.update(
        {
            uid: userId,
            email: veriInfo.email,
            password: hashedPassword,
            nickname: veriInfo.nickname,
            register_done: true,
            salt: salt
        },
        {
            where: {
                phone: phone,
                username: name,
            }
        }
    )
    .then(() => {
        return {
            userId
        }
    })
        
}


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
 
exports.verifyPhone = async (mobileInfo) => {

    const veriInfo = mobileRequires(mobileInfo)
    
    const foundUser = await __db.USER.findOne({
        where: {
            phone: veriInfo.phone,
            username: veriInfo.name,
        }
    })

    // 방어 코드
    if(foundUser) {
        if(foundUser.phone_verified 
            && foundUser.register_done) {
            throw new Error('이미 등록 완료된 전화번호 입니다.')
        }

        //TODO: 사용자 핸드폰 인증
        //

        return __db.USER.update(
            {
                phone_verified: true,
            },
            {
                where: {
                    phone:foundUser.phone,
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

    //TODO: 사용자 핸드폰 인증 - step 1
    //

    return __db.USER.create({
        email: '',
        phone: veriInfo.phone,
        phone_verified: false,
        password: '',
        nickname: '',
        username: veriInfo.name,
        register_done: false,
        salt: ''
    }).then(newUser => {

        //TODO: 사용자 핸드폰 인증 - step 2
        //
        
        return __db.USER.update(
            {
                phone_verified: true,
            },
            {
                where: {
                    phone: veriInfo.phone,
                    username: veriInfo.name,
                    phone_verified: false,
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

exports.verify = async (email, password) => {

    const user = await __db.USER.findOne({
        where: {
            email
        }
    })

    if(!user) {
        throw new Error('사용자를 찾을 수 없습니다.')
    }

    return {
        user,
        verified: await verifyPassword(password, user.salt, user.password)
    }
}

exports.signinToken = async (user) => {
    const refreshToken = generateRefreshToken()

    await __db.USER.update(
        {
            refresh_token: refreshToken,
        },
        {
            where: {
                email: user.email
            }
        }
    )

    return {
        access_token : generateUserToken({ user_id: user.uid }),
        refresh_token: refreshToken
    }

}

exports.userInfo = async (userId, user) => {

    if(userId !== user.user_id) {
        throw new Error('사용자가 일치 하지 않습니다.')
    }

    const foundUser = await __db.USER.findOne({
        where: {
            uid: user.user_id
        }
    }) 

    return {
        email: foundUser.email,
        username: foundUser.username,
        nickname: foundUser.nickname,
        phone: foundUser.phone
    }
}

