import CustomError from '../utils/errors/customError';
import JwtAuthorizer from '../utils/authorizers/jwtAuthorizer';

export default class AuthorizationService {
    constructor(userService) {
        this.userService = userService;
    }

    async login(username, password) {
        if (!username || !password) { // use joi
            throw new CustomError(400, 'Username or password do not exist.');
        }

        const user = await this.userService.getUserByLogin(username);

        if (!user || user.password !== password) {
            throw new CustomError(400, 'Username or password is incorrect.');
        }

        const jwtToken = JwtAuthorizer.getToken({ id: user.id, login: user.login, age: user.age });

        return jwtToken;
    }
}
