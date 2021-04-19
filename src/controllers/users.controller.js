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

    getAllUsers = (req, res) => {
        const users = this.userRepository.getUsers();
        res.send({ users });
    }

    getUser = (req, res) => {
        const userId = req.params.userId || '';
        const user = this.userRepository.getUser(userId);
        res.send({ user });
    }

    createUser = (req, res) => {
        const userFields = req.body;
        const user = this.userRepository.createUser(userFields);
        res.status(201).send({ user });
    }

    updateUser = (req, res) => {
        const newUserFields = req.body;
        const existedUser = req.existedUser;
        const newUser = {
            ...existedUser,
            ...newUserFields,
            id: existedUser.id
        };
        const user = this.userRepository.updateUser(newUser);
        res.send({ user });
    }

    getAutoSuggestUsers = (req, res) => {
        const {
            loginSubstring = '',
            limit = 0
        } = req.params;

        const users = this.userRepository.getAutoSuggestUsers(loginSubstring, limit);
        res.send({ users });
    }

    removeUser = (req, res) => {
        const userId = req.params.userId || '';
        const user = this.userRepository.removeUser(userId);
        res.send({ user });
    }

    handleUserIdParamMiddleware = (req, res, next, userId) => {
        const existedUser = this.userRepository.getUser(userId);
        if (!existedUser) {
            throw new CustomError(400, `User with '${userId}' id does not exist.`);
        }

        req.existedUser = existedUser;
        next();
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
