import express from 'express';
import db from './models';
import initUsersRoute from './routes/users.route';
import initGroupsRoute from './routes/groups.route';
import config from './config';

const PORT = config.port;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`'${req.method}' request was called on '${req.url}' url at '${(new Date()).toISOString()}'`);
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
