import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

function initGroupModel(sequelize, groupsTableName)  {
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
    }, { sequelize, modelName: 'Group', tableName: groupsTableName, timestamps: false });

    Group.beforeCreate((group) => {
        return group.id = uuidv4();
    });

    return Group;
}

export default initGroupModel;
