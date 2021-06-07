import CustomLogger from '../utils/loggers/customLogger';

export default class AuthorizationController {
    #errorLogger = (next, methodName, methodArguments) => (err) => { // part of the super Class for all controllers
        const logger = new CustomLogger('app:authorization.controller-ERROR');
        logger.addToMessage(`Controller method: ${methodName}`);
        methodArguments && logger.addToMessage(`Controller method arguments: ${JSON.stringify(methodArguments)}`);
        logger.addToMessage(`Error: ${err.message}`);
        logger.logToConsole();

        next(err);
    }

    constructor(service) {
        this.service = service;
    }

    login = (req, res, next) => {
        const {
            username,
            password
        } = req.body;


        this.service.login(username, password)
            .then(authToken => {
                res.send({ authToken });
            })
            .catch(this.#errorLogger(next, 'login', req.body));
    }
}
