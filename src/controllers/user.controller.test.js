import UserController from './user.controller';
import UserService from '../services/user.service';
import CustomError from '../utils/errors/customError';

const mockedUsers = [
    {
        'id': 'ac34d1e0-8ffe-11eb-a8b3-0242ac130001',
        'login': 'user-1',
        'password': 'u$er!',
        'age': 20,
        'isDeleted': false
    },
    {
        'id': 'ac34d97e-8ffe-11eb-a8b3-0242ac130003',
        'login': 'user-3',
        'password': 'u$er#',
        'age': 59,
        'isDeleted': true
    }
];

jest.mock('../services/user.service', () => ({
    getAllUsers: () => {
        return Promise.resolve(mockedUsers);
    },
    getUser: () => {
        return Promise.resolve(mockedUsers[0]);
    },
    createUser: () => {
        return Promise.resolve(mockedUsers[0]);
    },
    updateUser: () => {
        return Promise.resolve(mockedUsers[0]);
    },
    getAutoSuggestUsers: () => {
        return Promise.resolve(mockedUsers);
    },
    removeUser: () => {
        return Promise.resolve(mockedUsers[0]);
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
    req.query = {};
    req.existedUser = {};
    return req;
};

const mockNext = jest.fn();

const userController = new UserController(UserService);

afterEach(() => {
    jest.clearAllMocks();
});

describe('Test User Controller: getAllUsers', () => {
    test('Regular call', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        const getAllUsersService = jest.spyOn(UserService, 'getAllUsers');

        await userController.getAllUsers(mockReq, mockRes, mockNext);

        expect(getAllUsersService).toHaveBeenCalledTimes(1);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ users: mockedUsers });
    });

    test('Call with query params', async () => {
        const mockRes = mockResponse();
        const mockReq = mockRequest();
        mockReq.query = { data: 'test' };
        const getAllUsersService = jest.spyOn(UserService, 'getAllUsers');

        await userController.getAllUsers(mockReq, mockRes, mockNext);

        expect(getAllUsersService).toHaveBeenCalledTimes(0);
        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        const errorMessage = 'custom error';

        UserService.getAllUsers.mockImplementationOnce(() => Promise.reject(errorMessage));

        const getAllUsersService = jest.spyOn(UserService, 'getAllUsers');

        await userController.getAllUsers(mockReq, mockRes, mockNext);

        expect(getAllUsersService).toHaveBeenCalledTimes(1);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: getUser', () => {
    test('Regular call', async () => {
        const mockReq = mockRequest();
        mockReq.params = { userId: '123' };
        const mockRes = mockResponse();
        const getUserService = jest.spyOn(UserService, 'getUser');

        await userController.getUser(mockReq, mockRes, mockNext);

        expect(getUserService).toHaveBeenCalledTimes(1);
        expect(getUserService).toBeCalledWith('123');

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ user: mockedUsers[0] });
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        mockReq.params = { userId: '123' };
        const errorMessage = 'custom error';

        UserService.getUser.mockImplementationOnce(() => Promise.reject(errorMessage));

        const getUserService = jest.spyOn(UserService, 'getUser');

        await userController.getUser(mockReq, mockRes, mockNext);

        expect(getUserService).toHaveBeenCalledTimes(1);
        expect(getUserService).toBeCalledWith('123');

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: createUser', () => {
    test('Regular call', async () => {
        const userFields = {
            login: 'user-5-new', password: 'P@ssw0rd', age: 56
        };
        const mockReq = mockRequest();
        mockReq.body = userFields;
        const mockRes = mockResponse();
        const createUserService = jest.spyOn(UserService, 'createUser');

        await userController.createUser(mockReq, mockRes, mockNext);

        expect(createUserService).toHaveBeenCalledTimes(1);
        expect(createUserService).toBeCalledWith(userFields);

        expect(mockRes.status).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toBeCalledWith(201);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ user: mockedUsers[0] });
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        const userFields = {
            login: 'user-5-new', password: 'P@ssw0rd', age: 56
        };
        mockReq.body = userFields;
        const errorMessage = 'custom error';

        UserService.createUser.mockImplementationOnce(() => Promise.reject(errorMessage));

        const createUserService = jest.spyOn(UserService, 'createUser');

        await userController.createUser(mockReq, mockRes, mockNext);

        expect(createUserService).toHaveBeenCalledTimes(1);
        expect(createUserService).toBeCalledWith(userFields);

        expect(mockRes.status).toHaveBeenCalledTimes(0);
        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: updateUser', () => {
    test('Regular call', async () => {
        const userFields = {
            login: 'user-2-updated', password: 'U$er@1', age: 56
        };
        const mockReq = mockRequest();
        mockReq.body = userFields;
        mockReq.existedUser = mockedUsers[0];

        const mockRes = mockResponse();
        const updateUserService = jest.spyOn(UserService, 'updateUser');

        await userController.updateUser(mockReq, mockRes, mockNext);

        expect(updateUserService).toHaveBeenCalledTimes(1);
        expect(updateUserService).toBeCalledWith(userFields, mockedUsers[0]);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ user: mockedUsers[0] });
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        const userFields = {
            login: 'user-2-updated', password: 'U$er@1', age: 56
        };
        mockReq.body = userFields;
        mockReq.existedUser = mockedUsers[0];
        const errorMessage = 'custom error';

        UserService.updateUser.mockImplementationOnce(() => Promise.reject(errorMessage));

        const updateUserService = jest.spyOn(UserService, 'updateUser');

        await userController.updateUser(mockReq, mockRes, mockNext);

        expect(updateUserService).toHaveBeenCalledTimes(1);
        expect(updateUserService).toBeCalledWith(userFields, mockedUsers[0]);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: getAutoSuggestUsers', () => {
    test('Regular call', async () => {
        const mockReq = mockRequest();
        mockReq.query = {
            loginSubstring: 'use',
            limit: 3
        };

        const mockRes = mockResponse();
        const getAutoSuggestUsersService = jest.spyOn(UserService, 'getAutoSuggestUsers');

        await userController.getAutoSuggestUsers(mockReq, mockRes, mockNext);

        expect(getAutoSuggestUsersService).toHaveBeenCalledTimes(1);
        expect(getAutoSuggestUsersService).toBeCalledWith('use', 3);

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ users: mockedUsers });
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        mockReq.query = {
            loginSubstring: 'use',
            limit: 3
        };
        const errorMessage = 'custom error';

        UserService.getAutoSuggestUsers.mockImplementationOnce(() => Promise.reject(errorMessage));

        const getAutoSuggestUsersService = jest.spyOn(UserService, 'getAutoSuggestUsers');

        await userController.getAutoSuggestUsers(mockReq, mockRes, mockNext);

        expect(getAutoSuggestUsersService).toHaveBeenCalledTimes(1);
        expect(getAutoSuggestUsersService).toBeCalledWith('use', 3);

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: removeUser', () => {
    test('Regular call', async () => {
        const mockReq = mockRequest();
        mockReq.params = { userId: '123' };

        const mockRes = mockResponse();
        const removeUserService = jest.spyOn(UserService, 'removeUser');

        await userController.removeUser(mockReq, mockRes, mockNext);

        expect(removeUserService).toHaveBeenCalledTimes(1);
        expect(removeUserService).toBeCalledWith('123');

        expect(mockRes.send).toHaveBeenCalledTimes(1);
        expect(mockRes.send).toBeCalledWith({ user: mockedUsers[0] });
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        mockReq.params = { userId: '123' };
        const errorMessage = 'custom error';

        UserService.removeUser.mockImplementationOnce(() => Promise.reject(errorMessage));

        const removeUserService = jest.spyOn(UserService, 'removeUser');

        await userController.removeUser(mockReq, mockRes, mockNext);

        expect(removeUserService).toHaveBeenCalledTimes(1);
        expect(removeUserService).toBeCalledWith('123');

        expect(mockRes.send).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
    });
});

describe('Test User Controller: handleUserIdParamMiddleware', () => {
    test('Regular call', async () => {
        const mockReq = mockRequest();
        const userId = '123';
        const mockRes = mockResponse();
        const getUserService = jest.spyOn(UserService, 'getUser');

        await userController.handleUserIdParamMiddleware(mockReq, mockRes, mockNext, userId);

        expect(getUserService).toHaveBeenCalledTimes(1);
        expect(getUserService).toBeCalledWith(userId);

        expect(mockNext).toHaveBeenCalledTimes(1);

        expect(mockReq.existedUser).toEqual(mockedUsers[0]);
    });

    test('User with id is not found', async () => {
        const mockReq = mockRequest();
        const userId = '123';
        const mockRes = mockResponse();

        UserService.getUser.mockImplementationOnce(() => Promise.resolve());

        const getUserService = jest.spyOn(UserService, 'getUser');

        await userController.handleUserIdParamMiddleware(mockReq, mockRes, mockNext, userId);

        expect(getUserService).toHaveBeenCalledTimes(1);
        expect(getUserService).toBeCalledWith(userId);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(new CustomError(400, `User with '${userId}' id does not exist.`));
        expect(mockReq.existedUser).toEqual({});
    });

    test('Error in User Sevice', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();
        const userId = '123';
        const errorMessage = 'custom error';

        UserService.getUser.mockImplementationOnce(() => Promise.reject(errorMessage));

        const getUserService = jest.spyOn(UserService, 'getUser');

        await userController.handleUserIdParamMiddleware(mockReq, mockRes, mockNext, userId);

        expect(getUserService).toHaveBeenCalledTimes(1);
        expect(getUserService).toBeCalledWith(userId);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(errorMessage);
        expect(mockReq.existedUser).toEqual({});
    });
});

describe('Test User Controller: handleUserBodyValidationMiddleware', () => {
    test('Regular error', async () => {
        const mockReq = mockRequest();
        const error = 'test error';
        const mockRes = mockResponse();

        userController.handleUserBodyValidationMiddleware(error, mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(error);
    });

    test('Custom error', async () => {
        const mockReq = mockRequest();
        const error = {
            error: {
                isJoi: true,
                toString: () => error
            }
        };
        const mockRes = mockResponse();

        userController.handleUserBodyValidationMiddleware(error, mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toBeCalledWith(new CustomError(400, error));
    });
});
