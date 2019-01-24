export class BusinessException {
    public status: number;
    public userMessage: string;
    public technicalMessage: string;

    constructor(status: number, userMessage: string, technicalMessage?: string) {
        this.status = status || 500;
        this.userMessage = userMessage;
        this.technicalMessage = technicalMessage;
    }
}
