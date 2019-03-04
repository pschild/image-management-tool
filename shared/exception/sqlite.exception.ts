import { BusinessException } from './business.exception';

export class SqLiteException extends BusinessException {
    constructor(userMessageOrConfig: string | { status?: number; userMessage: string; technicalMessage?: string; errno?: string; }) {
        if (typeof userMessageOrConfig === 'string') {
            super(undefined, userMessageOrConfig);
        } else {
            super(userMessageOrConfig.status, userMessageOrConfig.userMessage, userMessageOrConfig.technicalMessage);
        }
    }
}
