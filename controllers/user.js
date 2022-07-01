const { 
    validation, 
    createPassword, 
    verifyPassword,
    generateUserToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require('@utils')

const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
 
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

    if(foundUser.register_done) {
        throw new Error('이미 등록한 사용자 입니다.')
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

    //TODO: 사용자 핸드폰 인증
    //
    
    const foundUser = await __db.USER.findOne({
        where: {
            phone: veriInfo.phone,
            username: veriInfo.name,
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

exports.verifyWithEmail = async (email, password) => {

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


exports.verifyWithPhone = async (phone, username, password) => {

    const user = await __db.USER.findOne({
        where: {
            phone,
            username
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

    if(!foundUser) {
        throw new Error('사용자를 찾을 수 없습니다.')
    }

    return {
        email: foundUser.email,
        username: foundUser.username,
        nickname: foundUser.nickname,
        phone: foundUser.phone
    }
}

exports.refreshToken = async (user) => {

    const foundUser = await __db.USER.findOne({
        where: {
            uid: user.user_id
        }
    }) 

    if(!foundUser) {
        throw new Error('사용자를 찾을 수 없습니다.')
    }

    if (user.refresh_token !== foundUser.refresh_token) {
        throw new Error('토큰 갱신을 할 수 없습니다.')
    }

    if(!verifyRefreshToken(user.refresh_token)) {
        throw new Error('재로그인이 필요 합니다.')
    }

    return {
        access_token : generateUserToken({ user_id: foundUser.uid }),
        refresh_token: foundUser.refresh_token
    }
}

exports.resetPassword = async (user) => {

    const { phone, name } = user

    const foundUser = await __db.USER.findOne({
        where: {
            phone: phone,
            username: name,
            phone_verified: true,
        }
    })

    if(!foundUser) {
        throw new Error('사용자를 찾을 수 없습니다.')
    }

    const randomString = crypto.randomBytes(12).toString('base64')

    const { hashedPassword, salt } = await createPassword(randomString)

    return __db.USER.update(
        {
            password: hashedPassword,
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
            tmp_password: randomString
        }
    })
}

exports.changePassword = async (user, passwordInfo) => {
    const { password,  checkPassword } = passwordInfo
    vaildPassword(password, checkPassword)

    const { hashedPassword, salt } = await createPassword(password)

    return __db.USER.update(
        {
            password: hashedPassword,
            salt: salt
        },
        {
            where: {
                uid: user.user_id
            }
        }
    )
    .then(() => {
        return {}
    })
}