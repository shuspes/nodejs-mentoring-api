export default class GroupController {
    constructor(service) {
        this.service = service;
    }

    getGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';

        this.service.getGroup(groupId)
            .then(group => {
                res.send({ group });
            })
            .catch(next);
    }

    getAllGroups = (req, res, next) => {
        this.service.getAllGroups()
            .then(groups => {
                res.send({ groups });
            })
            .catch(next);
    }

    createGroup = (req, res, next) => {
        const groupFields = req.body;
        this.service.createGroup(groupFields)
            .then(group => {
                res.status(201).send({ group });
            })
            .catch(next);
    }

    updateGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        const newGroupFields = req.body;

        this.service.updateGroup(groupId, newGroupFields)
            .then(group => {
                res.send({ group });
            })
            .catch(next);
    }

    removeGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        this.service.removeGroup(groupId)
            .then(id => {
                res.send({ deletedGroup: id });
            })
            .catch(next);
    }

    addUsersToGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        const userIds = req.body;

        this.service.addUsersToGroup(groupId, userIds)
            .then(data => {
                res.send({ data });
            })
            .catch(next);
    }
}
