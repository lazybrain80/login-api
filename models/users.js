'use strict'

module.exports = (sequelize, DataType) => {
    return [
        sequelize.define(
            'USERS',
            {
                email: { type: DataType.TEXT, primaryKey: true },
                phone: { type: DataType.TEXT, primaryKey: true },
                phone_verified: DataType.BOOLEAN,
                password: DataType.TEXT,
                nickname: DataType.TEXT,
                username: DataType.TEXT,
                register_done: DataType.BOOLEAN,
                salt: DataType.TEXT,
            },
            { timestamps: false }
        ),
        
    ]
}
