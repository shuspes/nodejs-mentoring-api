import { v4 as uuidv4 } from 'uuid';
import initialUsersList from '../database/initialUsersList';
import CustomError from '../errors/customError';

export default class LocalUserRepository {
    #users = initialUsersList;

    #generateUserId() {
        return uuidv4();
    }

    #sortByProperty(userProperty) {
        return (a, b) => {
            if (a[userProperty] < b[userProperty]) {
                return -1;
            }
            if (a[userProperty] > b[userProperty]) {
                return 1;
            }
            return 0;
        };
    }

    getUsers() {
        return Promise.resolve(this.#users);
    }

    getUser(id) {
        return Promise.resolve(this.#users.find(user => user.id === id));
    }

    createUser(user) {
        const createdUser = {
            ...user,
            id: this.#generateUserId(),
            isDeleted: false
        };

        this.#users.push(createdUser);
        return Promise.resolve(createdUser);
    }

    updateUser(user) {
        const existedUserIndex = this.#users.findIndex(element => element.id === user.id);
        if (existedUserIndex < 0) {
            return Promise.reject(new CustomError(400, `User with '${user.id}' id does not exist.`));
        }

        this.#users[existedUserIndex] = user;
        return Promise.resolve(user);
    }

    getAutoSuggestUsers(loginSubstring, limit) {
        return Promise.resolve(this.#users.filter(element => !element.isDeleted)
            .slice(0, limit)
            .filter(element => element.login.includes(loginSubstring))
            .sort(this.#sortByProperty('login')));
    }

    removeUser(id) {
        const existedUserIndex = this.#users.findIndex(element => element.id === id);
        if (existedUserIndex < 0) {
            return Promise.reject(new CustomError(400, `User with '${id}' id does not exist.`));
        }

        this.#users[existedUserIndex].isDeleted = true;
        return Promise.resolve(this.#users[existedUserIndex]);
    }
}
