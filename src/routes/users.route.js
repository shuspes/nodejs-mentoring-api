import express from 'express';
import UsersController from '../controllers/users.controller';

const router = express.Router(); 
const usersController = new UsersController();

router.use(express.json());

router.param('userId', usersController.handleUserIdParamMiddleware);

router.get('/', usersController.getAllUsers);

router.get('/:userId', usersController.getUser);

router.post('/', usersController.createUser);

router.put('/:userId', usersController.updateUser);

router.get('/:loginSubstring/:limit', usersController.getAutoSuggestUsers);

router.delete('/:userId', usersController.removeUser);

// middleware to handle errors to send 400 response

export default router;