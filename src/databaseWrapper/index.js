import DatabaseConnector from './inMemoryStorage';

export default function init() {
    return new DatabaseConnector();
}