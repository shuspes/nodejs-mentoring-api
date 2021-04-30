const defaultGroup = {
    id: 'd29e2030-a9e3-11eb-bcbc-0242ac130001',
    name: 'group-1',
    permissions: ['READ', 'DELETE']
};

export default class GroupService {
    constructor(repository) {
        this.repository = repository;
    }

    getGroup(groupId) {
        return Promise.resolve(defaultGroup);
    }

    getAllGroups() {
        return Promise.resolve([defaultGroup]);
    }

    createGroup(groupFields) {
        return Promise.resolve(groupFields);
    }

    updateGroup(groupId, newGroupFields) {
        const newGroup = {
            ...newGroupFields,
            id: groupId
        };
        return Promise.resolve(newGroup);
    }

    removeGroup(groupId) {
        return Promise.resolve(defaultGroup);
    }
}
