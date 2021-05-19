export default class CustomLogger {
    constructor() {
        this.message = `--->  TIME: ${(new Date()).toISOString()}`;
    }

    addToMessage(additionalMessage) {
        this.message += `\n${additionalMessage}`;
    }

    logToConsole() {
        console.log(`\n${this.message}\n<---\n`);
    }
}
