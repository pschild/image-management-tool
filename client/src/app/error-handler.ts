import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from './core/services/dialog.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: any) {
        console.error(error);

        const dialogService = this.injector.get(DialogService);

        let configuration;
        if (error.userMessage) {
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
