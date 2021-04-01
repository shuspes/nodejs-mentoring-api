import databaseWrapper from '../databaseWrapper';

export default class UsersController {
    constructor() {
        this.databaseWrapper = databaseWrapper();
    }

    getAllUsers = (req, res) => {
        const users = this.databaseWrapper.getUsers();        
        res.send({ users });
    }

    getUser = (req, res) => {
        const userId = req.params.userId || '';
        const user = this.databaseWrapper.getUser(userId);
        res.send({ user });
    }

    createUser = (req, res) => {
        const userFields = req.body;
        const user = this.databaseWrapper.createUser(userFields);
        res.send({ user });
    }

    updateUser = (req, res) => {
        const newUserFields = req.body;
        const existedUser = req.existedUser;
        const newUser = {...existedUser, ...newUserFields, id: existedUser.id};
        const user = this.databaseWrapper.updateUser(newUser);
        res.send({ user });
    }

    getAutoSuggestUsers = (req, res) => {
        const {
            loginSubstring = '',
            limit = 0
        } = req.params;
        
        const users = this.databaseWrapper.getAutoSuggestUsers(loginSubstring, limit);
        res.send({ users });
    }

    removeUser = (req, res) => {
        const userId = req.params.userId || '';
        const user = this.databaseWrapper.removeUser(userId);
        res.send({ user });
    }

    handleUserIdParamMiddleware = (req, res, next, userId) => {
        const existedUser = this.databaseWrapper.getUser(userId);
        if(!existedUser) {
            throw new Error(`User with '${userId}' id does not exist.`);
        }

        req.existedUser = existedUser;
        next();
    }
}