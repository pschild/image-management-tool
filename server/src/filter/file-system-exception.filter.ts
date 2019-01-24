import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FileSystemException } from '../../../shared/exception/file-system.exception';

@Catch(FileSystemException)
export class FileSystemExceptionFilter implements ExceptionFilter {
    catch(exception: FileSystemException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception.status;
        const userMessage = exception.userMessage;
        const technicalMessage = exception.technicalMessage;
        const errno = exception.errno;

        console.error(errno);
        console.error(technicalMessage);

        response
            .status(status)
            .json({
                success: false,
                userMessage
            });
    }
}
