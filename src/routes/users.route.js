import express from 'express';
import UsersController from '../controllers/users.controller';

const router = express.Router();
const usersController = new UsersController();

router.use(express.json());

router.param('userId', usersController.handleUserIdParamMiddleware);

router.get('/', usersController.getAllUsers);

router.get('/:userId', usersController.getUser);

router.post('/', usersController.getUserBodyValidator(), usersController.createUser);

router.put('/:userId', usersController.getUserBodyValidator(), usersController.updateUser);

router.get('/:loginSubstring/:limit', usersController.getAutoSuggestUsers);

router.delete('/:userId', usersController.removeUser);

router.use(usersController.handleUserBodyValidationMiddleware);

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
    console.error('ERROR: ', err);
    res.status(400).send({ 'error': err.message });
});

export default router;
