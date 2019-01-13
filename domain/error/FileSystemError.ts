
export class FileSystemError {
    public httpCode = 500;
    public errorCode: string;
    public message: string;

    constructor(errorCode: string, message: string) {
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
