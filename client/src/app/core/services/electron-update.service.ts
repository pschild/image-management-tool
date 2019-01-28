import { Injectable } from '@angular/core';
import { AppUpdater } from 'electron-updater';
import { AppConfig } from '../../../environments/environment';
import { DialogService } from './dialog.service';
import { ElectronService } from './electron.service';
import { DialogResult } from '../../shared/dialog/dialog.enum';
import { IDialogResult } from '../../shared/dialog/dialog-config';

@Injectable({
    providedIn: 'root'
})
export class ElectronUpdateService {

    autoUpdater: AppUpdater;

    constructor(
        private electronService: ElectronService,
        private dialogService: DialogService
    ) {
        // Conditional imports
        if (this.electronService.isElectron()) {
            // enable autoUpdater for production builds only
            if (AppConfig.production) {
                this.autoUpdater = this.electronService.remote.getGlobal('autoUpdater');
                this.autoUpdater.autoDownload = false;
                this.bindUpdaterEvents();
                this.autoUpdater.checkForUpdates(); // TODO: re-check in certain intervals
            }
        }
    }

    bindUpdaterEvents() {
        this.autoUpdater.on('update-available', () => {
            this.dialogService.showYesNoDialog({
                title: 'Update verfügbar',
                message: 'Eine neue Version ist verfügbar. Wollen Sie die Software jetzt aktualisieren?'
            }).subscribe((dialogResult: IDialogResult) => {
                if (dialogResult.result === DialogResult.YES) {
                    this.autoUpdater.downloadUpdate();
                }
            });
        });

        /* NOT WORKING YET, see https://github.com/electron-userland/electron-builder/issues/2521
        this.autoUpdater.on('download-progress', (progressObj) => {
            console.log(`${progressObj.transferred} of ${progressObj.total} bytes (${progressObj.percent}%, ${progressObj.bytesPerSecond} byte/s)`);
        });
        */

        this.autoUpdater.on('update-downloaded', (info) => {
            this.dialogService.showYesNoDialog({
                title: 'Update heruntergeladen',
                message: 'Die aktuellste Version wurde heruntergeladen. Jetzt neu starten?'
            }).subscribe((dialogResult: IDialogResult) => {
                if (dialogResult.result === DialogResult.YES) {
                    this.autoUpdater.quitAndInstall();
                } else {
                    // When installing the new downloaded version is delayed by the user, it should be installed when closing it the next time.
                    // Currently there's an issue with that when the app is intalled for "all users" (e.g. under C:/Program Files/<APP_NAME>).
                    // When it's installed only for current user, it works.
                    // See https://github.com/electron-userland/electron-builder/issues/2363

                    // An alternative could be to force the installation directly after download
                    // (=> remove confirm and just notify that app will be closed and update will be installed)
                    this.autoUpdater.autoInstallOnAppQuit = true;
                }
            });
        });
    }

}
