import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BusinessExceptionFilter } from './business-exception.filter';
import { FileNotFoundException } from '../../../shared/exception/file-not-found.exception';

@Catch(FileNotFoundException)
export class FileNotFoundExceptionFilter extends BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: FileNotFoundException, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
