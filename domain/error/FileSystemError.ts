import { HttpError } from 'routing-controllers/http-error/HttpError';

export class FileSystemError extends HttpError {
    public errorCode: string;
    public message: string;

    constructor(errorCode: string, message: string) {
        super(500);
        Object.setPrototypeOf(this, FileSystemError.prototype);
        this.errorCode = errorCode;
        this.message = message;
    }

    toJSON() {
        return {
            status: this.httpCode,
            errorCode: this.errorCode,
            message: this.message
        };
    }
}
