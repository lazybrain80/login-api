'use strict'

module.exports = (sequelize, DataType) => {
    return [
        sequelize.define(
            'USER',
            {
                uid:  { type: DataType.TEXT, primaryKey: true },
                email: { type: DataType.TEXT, primaryKey: true },
                phone: DataType.TEXT,
                phone_verified: DataType.BOOLEAN,
                password: DataType.TEXT,
                nickname: DataType.TEXT,
                username: DataType.TEXT,
                register_done: DataType.BOOLEAN,
                salt: DataType.TEXT,
                refresh_token: DataType.TEXT,
            },
        ),
        
    ]
}
