import GroupModel from '../models/group';
import CustomError from '../errors/customError';

export default class PgGroupRepository {
    async getGroup(id) {
        try {
            const group = await GroupModel.findByPk(id);
            return group;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async getGroups() {
        try {
            const groups = await GroupModel.findAll({ raw : true });
            return groups;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async createGroup(groupFields) {
        try {
            const createdGroup = await GroupModel.create(groupFields);
            return createdGroup;
        } catch (err) {
            throw new CustomError(400, err.message);
        }
    }

    async updateGroup(group) {
        try {
            const result = await GroupModel.update(group, {
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
            const result = await GroupModel.destroy({
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
}
