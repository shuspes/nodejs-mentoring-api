// import UserRepository from './user.repository.local'; // in memory storage
import UserRepository from './user.repository'; // DB storage

export const createUserRepository = (userModel) => {
    return new UserRepository(userModel);
};
