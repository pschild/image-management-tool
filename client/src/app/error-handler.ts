import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from './core/services/dialog.service';
import { FileNotFoundException } from '../../../shared/exception/file-not-found.exception';
import { RelocationException } from '../../../shared/exception/relocation.exception';
import { DuplicateFileException } from '../../../shared/exception/duplicate-file.exception';
import { FileSystemException } from '../../../shared/exception/file-system.exception';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: any) {
        console.error(error);

        const dialogService = this.injector.get(DialogService);

        let configuration;
        if (error.name && error.userMessage) {
            switch (error.name) {
                // TODO: react to type of exception
                case DuplicateFileException.prototype.name:
                case FileSystemException.prototype.name:
                case FileNotFoundException.prototype.name:
                case RelocationException.prototype.name:
                    console.log(error.name);
                    break;
                default:
                    console.log('default');
            }
            configuration = {
                title: 'Fehler',
                message: `Es ist ein Fehler aufgetreten: ${error.userMessage}`
            };
        } else {
            configuration = {
                title: 'Unbekannter Fehler',
                message: `Es ist ein unbekannter Fehler aufgetreten: ${error.message || error.toString()}`
            };
        }

        dialogService.showErrorDialog(configuration);
    }
}
