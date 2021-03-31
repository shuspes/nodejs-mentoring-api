import express from 'express';
import UsersController from '../controllers/users.controller';

const router = express.Router(); 
const usersController = new UsersController();

router.get('/', usersController.getAllUsers);

router.get('/:userId', usersController.getUser);

router.post('/', usersController.createUser);

router.put('/:userId', usersController.updateUser);

router.get('/suggestions', usersController.getAutoSuggestUsers); // works as :userId

router.delete('/:userId', usersController.removeUser);

// error handle on route level

export default router;