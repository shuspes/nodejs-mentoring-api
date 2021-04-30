import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index';
import sequelize from '../database/dbConnection';

class Group extends Sequelize.Model {}

Group.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    permissions: {
        type: Sequelize.ARRAY(Sequelize.STRING) ,
        allowNull: false
    }
}, { sequelize, modelName: 'Group', tableName: config.database.groupsTableName, timestamps: false });

Group.beforeCreate((group) => {
    return group.id = uuidv4();
});

export default Group;
