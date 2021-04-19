import express from 'express';
import UserController from '../controllers/user.controller';
import CustomError from '../errors/customError';

const router = express.Router();
const userController = new UserController();

router.param('userId', userController.handleUserIdParamMiddleware);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.getUserBodyValidator(), userController.createUser);

router.route('/:userId')
    .get(userController.getUser)
    .put(userController.getUserBodyValidator(), userController.updateUser)
    .delete(userController.removeUser);

router.get('/:loginSubstring/:limit', userController.getAutoSuggestUsers);

router.use(userController.handleUserBodyValidationMiddleware);

router.use((err, req, res, next) => {
    console.error('users router layer ERROR: ', err);

    if (CustomError.isCustomError(err)) {
        res.status(err.code).send({ 'error': err.message });
    } else {
        return next(err);
    }
});

export default router;
