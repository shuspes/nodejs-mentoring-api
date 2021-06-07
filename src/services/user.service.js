export default class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllUsers() {
        return await this.repository.getUsers();
    }

    async getUser(userId) {
        return await this.repository.getUser(userId);
    }

    async createUser(userFields) {
        return await this.repository.createUser(userFields);
    }

    async updateUser(newUserFields, existedUser) {
        const newUser = {
            ...existedUser,
            ...newUserFields,
            id: existedUser.id
        };
        return await this.repository.updateUser(newUser);
    }

    async getAutoSuggestUsers(loginSubstring = '', limit = 0) {
        return await this.repository.getAutoSuggestUsers(loginSubstring, limit);
    }

    async getUserByLogin(login) {
        return await this.repository.getUserByLogin(login);
    }

    async removeUser(userId) {
        return await this.repository.removeUser(userId);
    }
}
