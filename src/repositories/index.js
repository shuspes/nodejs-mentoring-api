import UserRepository from './user.repository.local'; // in memory storage
// import userRepository from './user.repository'; // DB storage

export const createUserRepository = () => {
    return new UserRepository();
};
