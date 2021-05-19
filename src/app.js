import express from 'express';
import db from './models';
import initUsersRoute from './routes/users.route';
import initGroupsRoute from './routes/groups.route';
import config from './config';
import CustomLogger from './utils/loggers/customLogger';
import { isNotEmptyObject } from './utils/utils';

const PORT = config.port;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const logger = new CustomLogger('app:root-http');
    logger.addToMessage(`'${req.method}' HTTP method was called on '${req.url}' url ${req.originalUrl}`);
    isNotEmptyObject(req.body) && logger.addToMessage(`Request body: ${JSON.stringify(req.body)}`);
    isNotEmptyObject(req.query) && logger.addToMessage(`Request query: ${JSON.stringify(req.query)}`);
    logger.logToConsole();

    next();
});

app.use('/users', initUsersRoute(db.userModel));
app.use('/groups', initGroupsRoute(db.groupModel, db.sequelize));

app.get('/', (req, res) => {
    console.log('root is called');
    res.send('Hi from root');
});

app.use((err, req, res, next) => {
    console.error('app layer ERROR: ', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send({ 'error': err.message || err });
});

app.listen(PORT,  error => {
    if (error) {
        return console.error('ERROR: ', error);
    }
    console.log(`Application is listening port ${PORT}.`);
});
