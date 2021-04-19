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
        return this.#users;
    }

    getUser(id) {
        return this.#users.find(user => user.id === id);
    }

    createUser(user) {
        const createdUser = {
            ...user,
            id: this.#generateUserId(),
            isDeleted: false
        };

        this.#users.push(createdUser);
        return createdUser;
    }

    updateUser(user) {
        const existedUserIndex = this.#users.findIndex(element => element.id === user.id);
        if (existedUserIndex < 0) {
            throw new CustomError(400, `User with '${user.id}' id does not exist.`);
        }

        this.#users[existedUserIndex] = user;
        return user;
    }

    getAutoSuggestUsers(loginSubstring, limit) {
        return this.#users.filter(element => !element.isDeleted)
            .slice(0, limit)
            .filter(element => element.login.includes(loginSubstring))
            .sort(this.#sortByProperty('login'));
    }

    removeUser(id) {
        const existedUserIndex = this.#users.findIndex(element => element.id === id);
        if (existedUserIndex < 0) {
            throw new CustomError(400, `User with '${id}' id does not exist.`);
        }

        this.#users[existedUserIndex].isDeleted = true;
        return this.#users[existedUserIndex];
    }
}
