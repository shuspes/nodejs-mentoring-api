import Sequelize from 'sequelize';
import config from '../config/index';

const sequelize = new Sequelize(`${config.database.dialect}://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.dbName}`);

export default sequelize;
