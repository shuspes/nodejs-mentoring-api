import CustomError from '../errors/customError';

export default class PgGroupRepository {
    constructor(groupModel, sequelize) {
        this.sequelize = sequelize;
        this.groupModel = groupModel;
    }

    async getGroup(id) {
        try {
            const group = await this.groupModel.findByPk(id);
            return group;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async getGroups() {
        try {
            const groups = await this.groupModel.findAll({ raw : true });
            return groups;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async createGroup(groupFields) {
        try {
            const createdGroup = await this.groupModel.create(groupFields);
            return createdGroup;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async updateGroup(group) {
        try {
            const result = await this.groupModel.update(group, {
                where: {
                    id: group.id
                },
                returning: true
            });

            return result[1][0].get();
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async removeGroup(id) {
        try {
            const result = await this.groupModel.destroy({
                where: {
                    id
                },
                returning: true,
                checkExistance: true
            });

            if (result) {
                return id;
            }
            throw new CustomError(400, `Group with '${id}' id does not exist.`);
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async addUsersToGroup(groupId, userIds) {
        const t = await this.sequelize.transaction();

        try {
            const group = await this.getGroup(groupId);
            if (!group) {
                throw new CustomError(400, `Group with '${groupId}' id does not exist.`);
            }

            for (const userId of userIds) {
                const result = await group.addUser(userId, { transaction: t });
                if (!result) {
                    throw new CustomError(400, `Cannot add User with '${userId}' id to the Group with '${groupId}' id.`);
                }
            }

            await t.commit();
            return `${userIds} User was successfully added to the Group with '${groupId}' id.`;
        } catch (err) {
            await t.rollback();
            throw new CustomError(400, err.message);
        }
    }
}
