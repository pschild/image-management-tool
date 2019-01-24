import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DuplicateFileException } from '../../../shared/exception/duplicate-file.exception';
import { BusinessExceptionFilter } from './business-exception.filter';

@Catch(DuplicateFileException)
export class DuplicateFileExceptionFilter extends BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: DuplicateFileException, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
