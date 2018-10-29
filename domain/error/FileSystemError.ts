import { HttpError } from 'routing-controllers/http-error/HttpError';

export class FileSystemError extends HttpError {
    public errno: number;
    public message: string;

    constructor(errno: number, message: string) {
        super(500);
        Object.setPrototypeOf(this, FileSystemError.prototype);
        this.errno = errno;
        this.message = message;
    }

    toJSON() {
        return {
            status: this.httpCode,
            errno: this.errno,
            message: this.message
        };
    }
}
