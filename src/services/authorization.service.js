import CustomError from '../utils/errors/customError';

export default class AuthorizationService {
    constructor(userService, jwtAuthorizer) {
        this.userService = userService;
        this.jwtAuthorizer = jwtAuthorizer;
    }

    async login(username, password) {
        if (!username || !password) { // use joi
            throw new CustomError(400, 'Username or password do not exist.');
        }

        const user = await this.userService.getUserByLogin(username);

        if (!user || user.password !== password) {
            throw new CustomError(400, 'Username or password is incorrect.');
        }

        const jwtToken = this.jwtAuthorizer.getToken({ id: user.id, login: user.login, age: user.age });

        return jwtToken;
    }
}
