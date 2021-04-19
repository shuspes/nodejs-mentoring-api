import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { createUserRepository } from '../repositories';
import CustomError from '../errors/customError';

export default class UsersController {
    #validator = createValidator({ passError: true });

    #userBodySchema = Joi.object({
        'login': Joi.string().regex(/^[a-zA-Z0-9-]*$/).max(50).required(), // only letters, numbers and -
        'password': Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).max(50).required(), // password must contain at least one letter, one big letter and number
        'age': Joi.number().min(4).max(130).required() // user’s age must be between 4 and 130.
    });

    constructor() {
        this.userRepository = createUserRepository();
    }

    getAllUsers = (req, res, next) => {
        this.userRepository.getUsers()
            .then(users => {
                res.send({ users });
            })
            .catch(next);
    }

    getUser = (req, res, next) => {
        const userId = req.params.userId || '';
        this.userRepository.getUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    createUser = (req, res, next) => {
        const userFields = req.body;
        this.userRepository.createUser(userFields)
            .then(user => {
                res.status(201).send({ user });
            })
            .catch(next);
    }

    updateUser = (req, res, next) => {
        const newUserFields = req.body;
        const existedUser = req.existedUser;
        const newUser = {
            ...existedUser,
            ...newUserFields,
            id: existedUser.id
        };
        this.userRepository.updateUser(newUser)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    getAutoSuggestUsers = (req, res, next) => {
        const {
            loginSubstring = '',
            limit = 0
        } = req.params;

        this.userRepository.getAutoSuggestUsers(loginSubstring, limit)
            .then(users => {
                res.send({ users });
            })
            .catch(next);
    }

    removeUser = (req, res, next) => {
        const userId = req.params.userId || '';
        this.userRepository.removeUser(userId)
            .then(user => {
                res.send({ user });
            })
            .catch(next);
    }

    handleUserIdParamMiddleware = (req, res, next, userId) => {
        this.userRepository.getUser(userId)
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
