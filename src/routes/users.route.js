import express from 'express';
import UsersController from '../controllers/users.controller';
import CustomError from '../errors/customError';

const router = express.Router();
const usersController = new UsersController();

router.param('userId', usersController.handleUserIdParamMiddleware);

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.getUserBodyValidator(), usersController.createUser);

router.route('/:userId')
    .get(usersController.getUser)
    .put(usersController.getUserBodyValidator(), usersController.updateUser)
    .delete(usersController.removeUser);

router.get('/:loginSubstring/:limit', usersController.getAutoSuggestUsers);

router.use(usersController.handleUserBodyValidationMiddleware);

router.use((err, req, res, next) => {
    console.error('users router layer ERROR: ', err);

    if (CustomError.isCustomError(err)) {
        res.status(err.code).send({ 'error': err.message });
    } else {
        return next(err);
    }
});

export default router;
