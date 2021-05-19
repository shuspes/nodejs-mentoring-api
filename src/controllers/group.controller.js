import CustomLogger from '../utils/loggers/customLogger';

export default class GroupController {
    #errorLogger = (next, methodName, methodArguments) => (err) => {
        const logger = new CustomLogger('app:group.controller-ERROR');
        logger.addToMessage(`Controller method: ${methodName}`);
        methodArguments && logger.addToMessage(`Controller method arguments: ${JSON.stringify(methodArguments)}`);
        logger.addToMessage(`Error: ${err.message}`);
        logger.logToConsole();

        next(err);
    }

    constructor(service) {
        this.service = service;
    }

    getGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';

        this.service.getGroup(groupId)
            .then(group => {
                res.send({ group });
            })
            .catch(this.#errorLogger(next, 'getGroup', { groupId }));
    }

    getAllGroups = (req, res, next) => {
        this.service.getAllGroups()
            .then(groups => {
                res.send({ groups });
            })
            .catch(this.#errorLogger(next, 'getAllGroups'));
    }

    createGroup = (req, res, next) => {
        const groupFields = req.body;
        this.service.createGroup(groupFields)
            .then(group => {
                res.status(201).send({ group });
            })
            .catch(this.#errorLogger(next, 'createGroup', { groupFields }));
    }

    updateGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        const newGroupFields = req.body;

        this.service.updateGroup(groupId, newGroupFields)
            .then(group => {
                res.send({ group });
            })
            .catch(this.#errorLogger(next, 'updateGroup', { groupId, newGroupFields }));
    }

    removeGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        this.service.removeGroup(groupId)
            .then(id => {
                res.send({ deletedGroup: id });
            })
            .catch(this.#errorLogger(next, 'removeGroup', { groupId }));
    }

    addUsersToGroup = (req, res, next) => {
        const groupId = req.params.groupId || '';
        const userIds = req.body;

        this.service.addUsersToGroup(groupId, userIds)
            .then(data => {
                res.send({ data });
            })
            .catch(this.#errorLogger(next, 'addUsersToGroup', { groupId, userIds }));
    }
}
