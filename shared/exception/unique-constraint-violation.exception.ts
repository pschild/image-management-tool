import { SqLiteException } from './sqlite.exception';

export class UniqueConstraintViolationException extends SqLiteException {
    constructor(userMessageOrConfig: string | { status?: number; userMessage: string; technicalMessage?: string; errno?: string; }) {
        super(userMessageOrConfig);
    }
}
