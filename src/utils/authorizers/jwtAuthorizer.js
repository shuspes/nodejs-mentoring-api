import jwt from 'jsonwebtoken';
import CustomError from '../errors/customError';
import CustomLogger from '../loggers/customLogger';

export default class JwtAuthorizer {
    constructor(secret, tokenLifetime = 180) {
        this.secret = secret;
        this.tokenLifetime = tokenLifetime;
    }

    getToken(tokenBody) {
        return jwt.sign(tokenBody, this.secret, { expiresIn: this.tokenLifetime });
    }

    verifyToken(token) {
        return jwt.verify(token, this.secret);
    }

    authMiddleware = (req, res, next) => {
        const logger = new CustomLogger('jwtAuthorizer:authMiddleware call');

        const authHeader = req.headers.authorization;
        logger.addToMessage(`authHeader: ${authHeader}`);

        if (!authHeader) {
            logger.logToConsole();

            throw new CustomError(401, 'Authorization header is empty.');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = this.verifyToken(token);
            logger.addToMessage(`Decoded JWT token: ${JSON.stringify(decodedToken)}`);
        } catch (err) {
            logger.addToMessage(`verifyToken Error: ${err}`);
            logger.logToConsole();

            throw new CustomError(403, 'Access is denied.');
        }

        logger.logToConsole();
        next();
    }
}
