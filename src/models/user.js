import { v4 as uuidv4 } from 'uuid';

export default class User {
    constructor(id, login, password, age, isDeleted = false) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.age = age;
        this.isDeleted = isDeleted;
    }
}

export const createUserId = () => {
    return uuidv4();
}

export const isUser = user => {
    return user instanceof User;
}