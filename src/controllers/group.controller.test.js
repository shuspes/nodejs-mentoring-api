import GroupController from './group.controller';
import GroupService from '../services/group.service';

const mockedGroups = [
    {
        id: 'd29e2030-a9e3-11eb-bcbc-0242ac130002',
        name: 'group-2',
        permissions: '{"READ", "SHARE", "WRITE"}'
    },
    {
        id: 'd29e2030-a9e3-11eb-bcbc-0242ac130003',
        name: 'group-3',
        permissions: '{"READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"}'
    }
];

const groupId = '123';
const userIds = ['ac34d1e0-8ffe-11eb-a8b3-0242ac130004', 'ac34d83e-8ffe-11eb-a8b3-0242ac130002'];

const getUserWasAddedToGroupSuccessMessage = () => {
    return `${userIds.join(',')} User was successfully added to the Group with '${groupId}' id.`;
};

jest.mock('../services/group.service', () => ({
    getAllGroups: () => {
        return Promise.resolve(mockedGroups);
    },
    getGroup: () => {
        return Promise.resolve(mockedGroups[0]);
    },
    createGroup: () => {
        return Promise.resolve(mockedGroups[0]);
    },
    updateGroup: () => {
        return Promise.resolve(mockedGroups[0]);
    },
    addUsersToGroup: () => {
        return Promise.resolve(getUserWasAddedToGroupSuccessMessage());
    },
    removeGroup: () => {
        return Promise.resolve(groupId);
    }
}));

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = () => {
    const req = {};
    return req;
};

const mockNext = jest.fn();

const groupController = new GroupController(GroupService);

afterEach(() => {
    jest.clearAllMocks();
});

describe('Test Group Controller: getGroup', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };
        const getGroupGroupService = jest.spyOn(GroupService, 'getGroup');

        await groupController.getGroup(mockReq, mockRes, mockNext);

        expect(getGroupGroupService).toHaveBeenCalledTimes(1);
        expect(getGroupGroupService).toBeCalledWith(groupId);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ group: mockedGroups[0] });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };
        const errorMessage = 'custom error';

        GroupService.getGroup.mockImplementationOnce(() => Promise.reject(errorMessage));
        const getGroupGroupService = jest.spyOn(GroupService, 'getGroup');

        await groupController.getGroup(mockReq, mockRes, mockNext);

        expect(getGroupGroupService).toHaveBeenCalledTimes(1);
        expect(getGroupGroupService).toBeCalledWith(groupId);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test Group Controller: getAllGroups', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        const getAllGroupsGroupService = jest.spyOn(GroupService, 'getAllGroups');

        await groupController.getAllGroups(mockReq, mockRes, mockNext);

        expect(getAllGroupsGroupService).toHaveBeenCalledTimes(1);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ groups: mockedGroups });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        const errorMessage = 'custom error';

        GroupService.getAllGroups.mockImplementationOnce(() => Promise.reject(errorMessage));
        const getAllGroupsGroupService = jest.spyOn(GroupService, 'getAllGroups');

        await groupController.getAllGroups(mockReq, mockRes, mockNext);

        expect(getAllGroupsGroupService).toHaveBeenCalledTimes(1);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test Group Controller: createGroup', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();

        const groupFields = {
            name: 'group-5-new', permissions: ['READ', 'SHARE', 'UPLOAD_FILES']
        };
        mockReq.body = groupFields;

        const createGroupGroupService = jest.spyOn(GroupService, 'createGroup');

        await groupController.createGroup(mockReq, mockRes, mockNext);

        expect(createGroupGroupService).toHaveBeenCalledTimes(1);
        expect(createGroupGroupService).toBeCalledWith(groupFields);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toBeCalledWith(201);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ group: mockedGroups[0] });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();

        const groupFields = {
            name: 'group-5-new', permissions: ['READ', 'SHARE', 'UPLOAD_FILES']
        };
        mockReq.body = groupFields;
        const errorMessage = 'custom error';

        GroupService.createGroup.mockImplementationOnce(() => Promise.reject(errorMessage));
        const createGroupGroupService = jest.spyOn(GroupService, 'createGroup');

        await groupController.createGroup(mockReq, mockRes, mockNext);

        expect(createGroupGroupService).toHaveBeenCalledTimes(1);
        expect(createGroupGroupService).toBeCalledWith(groupFields);

        expect(mockRes.status).toHaveBeenCalledTimes(0);
        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test Group Controller: updateGroup', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        const groupFields = {
            permissions: ['UPLOAD_FILES']
        };
        mockReq.params = { groupId };
        mockReq.body = groupFields;

        const updateGroupGroupService = jest.spyOn(GroupService, 'updateGroup');

        await groupController.updateGroup(mockReq, mockRes, mockNext);

        expect(updateGroupGroupService).toHaveBeenCalledTimes(1);
        expect(updateGroupGroupService).toBeCalledWith(groupId, groupFields);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ group: mockedGroups[0] });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        const groupFields = {
            permissions: ['UPLOAD_FILES']
        };
        mockReq.params = { groupId };
        mockReq.body = groupFields;
        const errorMessage = 'custom error';

        GroupService.updateGroup.mockImplementationOnce(() => Promise.reject(errorMessage));
        const updateGroupGroupService = jest.spyOn(GroupService, 'updateGroup');

        await groupController.updateGroup(mockReq, mockRes, mockNext);

        expect(updateGroupGroupService).toHaveBeenCalledTimes(1);
        expect(updateGroupGroupService).toBeCalledWith(groupId, groupFields);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test Group Controller: removeGroup', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };

        const removeGroupGroupService = jest.spyOn(GroupService, 'removeGroup');

        await groupController.removeGroup(mockReq, mockRes, mockNext);

        expect(removeGroupGroupService).toHaveBeenCalledTimes(1);
        expect(removeGroupGroupService).toBeCalledWith(groupId);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ deletedGroup: groupId });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };
        const errorMessage = 'custom error';

        GroupService.removeGroup.mockImplementationOnce(() => Promise.reject(errorMessage));
        const removeGroupGroupService = jest.spyOn(GroupService, 'removeGroup');

        await groupController.removeGroup(mockReq, mockRes, mockNext);

        expect(removeGroupGroupService).toHaveBeenCalledTimes(1);
        expect(removeGroupGroupService).toBeCalledWith(groupId);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test Group Controller: addUsersToGroup', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };
        mockReq.body = userIds;

        const addUsersToGroupGroupService = jest.spyOn(GroupService, 'addUsersToGroup');

        await groupController.addUsersToGroup(mockReq, mockRes, mockNext);

        expect(addUsersToGroupGroupService).toHaveBeenCalledTimes(1);
        expect(addUsersToGroupGroupService).toBeCalledWith(groupId, userIds);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ data: getUserWasAddedToGroupSuccessMessage() });
    });

    test('Error in Group Sevice', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.params = { groupId };
        mockReq.body = userIds;
        const errorMessage = 'custom error';

        GroupService.addUsersToGroup.mockImplementationOnce(() => Promise.reject(errorMessage));
        const addUsersToGroupGroupService = jest.spyOn(GroupService, 'addUsersToGroup');

        await groupController.addUsersToGroup(mockReq, mockRes, mockNext);

        expect(addUsersToGroupGroupService).toHaveBeenCalledTimes(1);
        expect(addUsersToGroupGroupService).toBeCalledWith(groupId, userIds);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});
