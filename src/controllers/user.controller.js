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

    constructor(service) {
        this.service = service;
    }

    getAllUsers = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('getAllUsers');
        logger.logToConsole();
        // ---->

        if (isNotEmptyObject(req.query)) {
            return next();
        }

        this.service.getAllUsers()
            .then(users => {
                res.send({ users });
            })
            .catch(next);
    }

    getUser = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('getUser');
        logger.logToConsole();
        // ---->

        const userId = req.params.userId || '';
        this.service.getUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    createUser = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('createUser');
        logger.logToConsole();
        // ---->

        const userFields = req.body;
        this.service.createUser(userFields)
            .then(user => {
                res.status(201).send({ user });
            })
            .catch(next);
    }

    updateUser = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('updateUser');
        logger.logToConsole();
        // ---->

        const newUserFields = req.body;
        const existedUser = req.existedUser;

        this.service.updateUser(newUserFields, existedUser)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    getAutoSuggestUsers = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('getAutoSuggestUsers');
        logger.logToConsole();
        // ---->

        const {
            loginSubstring,
            limit
        } = req.query;

        this.service.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => {
                res.send({ users });
            })
            .catch(next);
    }

    removeUser = (req, res, next) => {
        // ---->
        const logger = new CustomLogger();
        logger.addToMessage('removeUser');
        logger.logToConsole();
        // ---->

        const userId = req.params.userId || '';
        this.service.removeUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    handleUserIdParamMiddleware = (req, res, next, userId) => {
        this.service.getUser(userId)
            .then(existedUser => {
                if (!existedUser) {
                    return Promise.reject(new CustomError(400, `User with '${userId}' id does not exist.`));
                }

                req.existedUser = existedUser;
                next();
            })
            .catch(next);
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
