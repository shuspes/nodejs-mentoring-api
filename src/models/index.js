import config from '../config/index';
import sequelize from '../database/dbConnection';
import initGroupModel from './group';
import initUserModel from './user';

const db = {};

const UserModel = initUserModel(sequelize, config.database.usersTableName);
const GroupModel = initGroupModel(sequelize, config.database.groupsTableName);

UserModel.belongsToMany(GroupModel, {
    through: 'user_group', foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'
});

GroupModel.belongsToMany(UserModel, {
    through: 'user_group', foreignKey: 'group_id', onUpdate: 'cascade', onDelete: 'cascade'
});

db.userModel = UserModel;
db.groupModel = GroupModel;

export default db;
