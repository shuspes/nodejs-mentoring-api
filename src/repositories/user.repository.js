import { Op } from 'sequelize';
import CustomError from '../utils/errors/customError';

export default class PgUserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getUsers() {
        try {
            const users = await this.userModel.findAll({ raw : true });
            return users;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async getUser(id) {
        try {
            const user = await this.userModel.findByPk(id);
            return user;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async createUser(user) {
        try {
            const createdUser = await this.userModel.create(user);
            return createdUser;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async updateUser(user) {
        try {
            const result = await this.userModel.update(user, {
                where: {
                    id: user.id
                },
                returning: true
            });
            return result[1][0].get();
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async getAutoSuggestUsers(loginSubstring, limit) {
        try {
            const users = await this.userModel.findAll({
                ...(limit && { limit }),
                where: {
                    isDeleted: false,
                    ...(loginSubstring && {
                        login: {
                            [Op.like]: `%${ loginSubstring }%`
                        }
                    })
                },
                order: [
                    ['login', 'ASC']
                ],
                raw : true
            });
            return users;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async removeUser(id) {
        try {
            const user = await this.getUser(id);
            return await this.updateUser({ ...user.get(), isDeleted: true });
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }
}
