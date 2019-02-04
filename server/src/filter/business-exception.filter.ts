import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BusinessException } from '../../../shared/exception/business.exception';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = exception.status;
        const userMessage = exception.userMessage;
        const technicalMessage = exception.technicalMessage;

        console.error(technicalMessage);

        response
            .status(status)
            .json({
                success: false,
                name: exception.name,
                userMessage
            });
    }
}
