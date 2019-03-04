import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BusinessExceptionFilter } from './business-exception.filter';
import { SqLiteException } from '../../../shared/exception/sqlite.exception';

@Catch(SqLiteException)
export class SqLiteExceptionFilter extends BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: SqLiteException, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
