import express from 'express';
import GroupController from '../controllers/group.controller';
import GroupService from '../services/group.service';
import GroupRepository from '../repositories/group.repository';

function initGroupsRoute(groupModel) {
    const router = express.Router();

    const groupRepository = new GroupRepository(groupModel);
    const groupService = new GroupService(groupRepository);
    const groupController = new GroupController(groupService);

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
