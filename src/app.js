import express from 'express';
import cors from 'cors';
import db from './models';
import { createUserRepository } from './repositories';
import GroupRepository from './repositories/group.repository';
import UserService from './services/user.service';
import GroupService from './services/group.service';
import AuthorizationService from './services/authorization.service';
import UserController from './controllers/user.controller';
import GroupController from './controllers/group.controller';
import AuthorizationController from './controllers/authorization.controller';
import initUsersRoute from './routes/users.route';
import initGroupsRoute from './routes/groups.route';
import initAuthorizationRoute from './routes/authorization.route';
import config from './config';
import JwtAuthorizer from './utils/authorizers/jwtAuthorizer';
import CustomLogger from './utils/loggers/customLogger';
import CustomError from './utils/errors/customError';
import { isNotEmptyObject } from './utils/utils';

const PORT = config.port;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const logger = new CustomLogger('app:root-http');
    logger.addToMessage(`'${req.method}' HTTP method was called on '${req.url}' url`);
    isNotEmptyObject(req.body) && logger.addToMessage(`Request body: ${JSON.stringify(req.body)}`);
    isNotEmptyObject(req.query) && logger.addToMessage(`Request query: ${JSON.stringify(req.query)}`);
    logger.logToConsole();

    next();
});

const jwtAuthorizer = new JwtAuthorizer(config.jwtSecretKey);

const userRepository = createUserRepository(db.userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
app.use('/users', initUsersRoute(userController, jwtAuthorizer));

const groupRepository = new GroupRepository(db.groupModel, db.sequelize);
const groupService = new GroupService(groupRepository);
const groupController = new GroupController(groupService);
app.use('/groups', initGroupsRoute(groupController, jwtAuthorizer));

const authorizationService = new AuthorizationService(userService, jwtAuthorizer);
const authorizationController = new AuthorizationController(authorizationService);
app.use('/auth', initAuthorizationRoute(authorizationController));

app.get('/', (req, res) => {
    console.log('root is called');
    res.send('Hi from root');
});

app.use((err, req, res, next) => {
    console.error('app layer ERROR: ', err);

    if (res.headersSent) {
        return next(err);
    }

    if (CustomError.isCustomError(err)) {
        res.status(err.code).send({ 'error': err.message });
    } else {
        res.status(500).send({ 'error': err.message || err });
    }
});

app.listen(PORT,  error => {
    if (error) {
        return console.error('ERROR: ', error);
    }
    console.log(`Application is listening port ${PORT}.`);
});

process.on('unhandledRejection', err => {
    const logger = new CustomLogger('app:unhandled-Rejection');
    logger.addToMessage(`Error: ${err}`);
    logger.logToConsole();
});

process.on('uncaughtException', err => {
    const logger = new CustomLogger('app:uncaught-Exception');
    logger.addToMessage(`Error: ${err}`);
    logger.logToConsole();
});
