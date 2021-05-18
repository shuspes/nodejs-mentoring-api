import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

function initUserModel(sequelize, usersTableName) {
    class User extends Sequelize.Model {}

    User.init({
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        login: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        age: {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, { sequelize, modelName: 'User', tableName: usersTableName, timestamps: false });

    User.beforeCreate((user) => {
        return user.id = uuidv4();
    });

    return User;
}

export default initUserModel;
