import UserDatabaseWrapper from './inMemoryUserStorage';

export default function init() {
    return new UserDatabaseWrapper();
}
