export default class CustomError {
    constructor(statusCode, errorMessage) {
        this.code = statusCode;
        this.message = errorMessage;
    }

    static isCustomError(error) {
        return error instanceof CustomError;
    }
}
