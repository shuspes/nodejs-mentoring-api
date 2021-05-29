import express from 'express';

function initGroupsRoute(groupController) {
    const router = express.Router();

    router.route('/')
        .get(groupController.getAllGroups)
        .post(groupController.createGroup);

    router.route('/:groupId')
        .get(groupController.getGroup)
        .put(groupController.updateGroup)
        .delete(groupController.removeGroup);

    router.route('/:groupId/users')
        .post(groupController.addUsersToGroup);

    return router;
}

export default initGroupsRoute;
