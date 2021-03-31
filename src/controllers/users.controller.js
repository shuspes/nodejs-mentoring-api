import databaseWrapper from '../databaseWrapper';
import User, { createUserId } from '../models/user';

export default class UsersController {
    constructor() {
        this.databaseWrapper = databaseWrapper();
    }

    getAllUsers(req, res) {
        // return this.databaseWrapper.getUsers();
        res.send('getAllUsers');
    }

    getUser(req, res) {
        // return this.databaseWrapper.getUser(id);
        res.send('getUser');
    }

    createUser(req, res) {
        // return this.databaseWrapper.createUser(user);
        res.send('createUser');
    }

    updateUser(req, res) {
        res.send('updateUser');
    }

    getAutoSuggestUsers(req, res) {
        res.send('getAutoSuggestUsers');
    }

    removeUser(req, res) {
        res.send('removeUser');
    }
}