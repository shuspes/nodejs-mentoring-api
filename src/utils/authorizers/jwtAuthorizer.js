import jwt from 'jsonwebtoken';
import config from '../../config';

export default class JwtAuthorizer {
    static getToken(tokenBody) {
        return jwt.sign(tokenBody, config.jwtSecretKey, { expiresIn: 120 });
    }
}
