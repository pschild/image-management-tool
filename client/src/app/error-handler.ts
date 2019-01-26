import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './shared/notification/error-dialog/error-dialog.component';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: any) {
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

        const dialog = this.injector.get(MatDialog);
        const dialogRef = dialog.open(ErrorDialogComponent, {
            width: '50%',
            data: configuration
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }
}
