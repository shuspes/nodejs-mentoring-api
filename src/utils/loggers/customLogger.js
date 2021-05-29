import colors from 'colors';

export default class CustomLogger {
    constructor(logName) {
        let initialMessage = logName ? `${colors.magenta(logName)}  ` : '';
        initialMessage += colors.cyan('--->');
        initialMessage += `\n${colors.green(`TIME: ${(new Date()).toISOString()}`)}`;

        this.message = initialMessage;
    }

    addToMessage(additionalMessage) {
        this.message += `\n${additionalMessage}`;
    }

    logToConsole() {
        console.log(`\n${this.message}\n${colors.cyan('<---')}\n`);
    }
}
