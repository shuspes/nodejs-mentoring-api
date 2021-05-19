import express from 'express';
import { createUserRepository } from '../repositories';
import UserService from '../services/user.service';
import UserController from '../controllers/user.controller';
import CustomError from '../errors/customError';

function initUsersRoute(userModel) {
    const router = express.Router();

    const userRepository = createUserRepository(userModel);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.param('userId', userController.handleUserIdParamMiddleware);

    router.route('/')
        .get([userController.getAllUsers, userController.getAutoSuggestUsers])
        .post(userController.getUserBodyValidator(), userController.createUser);

    router.route('/:userId')
        .get(userController.getUser)
        .put(userController.getUserBodyValidator(), userController.updateUser)
        .delete(userController.removeUser);

    router.use(userController.handleUserBodyValidationMiddleware);

    router.use((err, req, res, next) => {
        console.error('users router layer ERROR: ', err);

        if (CustomError.isCustomError(err)) {
            res.status(err.code).send({ 'error': err.message });
        } else {
            return next(err);
        }
    });

    return router;
}

export default initUsersRoute;
