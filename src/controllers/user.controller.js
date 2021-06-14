import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import CustomError from '../utils/errors/customError';
import { isNotEmptyObject } from '../utils/utils';
import CustomLogger from '../utils/loggers/customLogger';

export default class UserController {
    #validator = createValidator({ passError: true });

    #userBodySchema = Joi.object({
        'login': Joi.string().regex(/^[a-zA-Z0-9-]*$/).max(50).required(), // only letters, numbers and -
        'password': Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).max(50).required(), // password must contain at least one letter, one big letter and number
        'age': Joi.number().min(4).max(130).required() // user’s age must be between 4 and 130.
    });

    #errorLogger = (next, methodName, methodArguments) => (err) => {
        const logger = new CustomLogger('app:user.controller-ERROR');
        logger.addToMessage(`Controller method: ${methodName}`);
        methodArguments && logger.addToMessage(`Controller method arguments: ${JSON.stringify(methodArguments)}`);
        logger.addToMessage(`Error: ${err.message}`);
        logger.logToConsole();

        next(err);
    }

    constructor(service) {
        this.service = service;
    }

    getAllUsers = (req, res, next) => {
        if (isNotEmptyObject(req.query)) {
            return next();
        }

        return this.service.getAllUsers()
            .then(users => {
                res.send({ users });
            })
            .catch(this.#errorLogger(next, 'getAllUsers'));
    }

    getUser = (req, res, next) => {
        const userId = req.params.userId || '';
        return this.service.getUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(this.#errorLogger(next, 'getUser', { userId }));
    }

    createUser = (req, res, next) => {
        const userFields = req.body;
        return this.service.createUser(userFields)
            .then(user => {
                res.status(201).send({ user });
            })
            .catch(this.#errorLogger(next, 'createUser', req.body));
    }

    updateUser = (req, res, next) => {
        const newUserFields = req.body;
        const existedUser = req.existedUser;

        return this.service.updateUser(newUserFields, existedUser)
            .then(user => {
                res.send({ user });
            })
            .catch(this.#errorLogger(next, 'updateUser', { newUserFields, existedUser }));
    }

    getAutoSuggestUsers = (req, res, next) => {
        const {
            loginSubstring,
            limit
        } = req.query;

        return this.service.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => {
                res.send({ users });
            })
            .catch(this.#errorLogger(next, 'getAutoSuggestUsers', req.query));
    }

    removeUser = (req, res, next) => {
        const userId = req.params.userId || '';
        return this.service.removeUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(this.#errorLogger(next, 'removeUser', { userId }));
    }

    handleUserIdParamMiddleware = (req, res, next, userId) => {
        return this.service.getUser(userId)
            .then(existedUser => {
                if (!existedUser) {
                    return Promise.reject(new CustomError(400, `User with '${userId}' id does not exist.`));
                }

                req.existedUser = existedUser;
                next();
            })
            .catch(this.#errorLogger(next, 'handleUserIdParamMiddleware', { userId }));
    }

    getUserBodyValidator = () => {
        return this.#validator.body(this.#userBodySchema);
    }

    handleUserBodyValidationMiddleware = (err, req, res, next) => {
        const error = err && err.error && err.error.isJoi
            ? new CustomError(400, err.error.toString())
            : err;

        next(error);
    }
}
