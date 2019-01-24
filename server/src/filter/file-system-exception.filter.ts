import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FileSystemException } from '../../../shared/exception/file-system.exception';
import { BusinessExceptionFilter } from './business-exception.filter';

@Catch(FileSystemException)
export class FileSystemExceptionFilter extends BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: FileSystemException, host: ArgumentsHost) {
        console.error(exception.errno);

        super.catch(exception, host);
    }
}
