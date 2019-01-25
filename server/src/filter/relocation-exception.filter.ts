import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BusinessExceptionFilter } from './business-exception.filter';
import { RelocationException } from '../../../shared/exception/relocation.exception';

@Catch(RelocationException)
export class RelocationExceptionFilter extends BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: RelocationException, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
