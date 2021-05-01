export default class GroupService {
    constructor(repository) {
        this.repository = repository;
    }

    async getGroup(groupId) {
        return await this.repository.getGroup(groupId);
    }

    async getAllGroups() {
        return await this.repository.getGroups();
    }

    async createGroup(groupFields) {
        return await this.repository.createGroup(groupFields);
    }

    async updateGroup(groupId, newGroupFields) {
        const newGroup = {
            ...newGroupFields,
            id: groupId
        };
        return await this.repository.updateGroup(newGroup);
    }

    async removeGroup(groupId) {
        return await this.repository.removeGroup(groupId);
    }
}
