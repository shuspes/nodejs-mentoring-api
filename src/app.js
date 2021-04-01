import express from 'express';
import users from './routes/users.route';

const PORT = 3000; // process.env.port
const app = express();

app.use((req, res, next) => {
    console.log(`'${req.method}' request was called on '${req.url}' url at '${(new Date()).toISOString()}'`);
    next();
});

app.use('/users', users);

app.get('/', (req, res) => {
    console.log('root is called');
    res.send('Hi from root');
});

app.use((err, req, res, next) => {
    console.error('ERROR: ', err);
    res.status(500).send({'error': err.message});
});

app.listen(PORT,  error => {
    if(error) {
        return console.error('ERROR: ', error);
    }
    console.log(`Application is listening port ${PORT}.`);
});