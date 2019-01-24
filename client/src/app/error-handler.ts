import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from './core/services/dialog.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: any) {
        const dialogService = this.injector.get(DialogService);
        if (error.userMessage) {
            dialogService.showErrorBox('FileSystemException', `Es ist ein Fehler aufgetreten: ${error.userMessage}`);
        } else {
            dialogService.showErrorBox('Unbekannter Fehler', `Es ist ein unbekannter Fehler aufgetreten: ${error}`);
        }
    }
}
