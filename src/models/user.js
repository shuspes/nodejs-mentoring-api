import Sequelize from 'sequelize';
import sequelize from '../database/dbConnection';

class User extends Sequelize.Model {}

User.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    login: {
        type: Sequelize.CHAR(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.CHAR(50),
        allowNull: false
    },
    age: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN
    }
}, { sequelize, modelName: 'User', tableName: 'users', timestamps: false });

export default User;
