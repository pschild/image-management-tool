import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { AppUpdater } from 'electron-updater';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  autoUpdater: AppUpdater;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      // enable autoUpdater for production builds only
      if (AppConfig.production) {
        this.autoUpdater = this.remote.getGlobal('autoUpdater');
        this.autoUpdater.autoDownload = false;
        this.bindUpdaterEvents();
        this.autoUpdater.checkForUpdates(); // TODO: re-check in certain intervals
      }
    }
  }

  bindUpdaterEvents() {
    this.autoUpdater.on('update-available', () => {
      const confirmed = confirm('Eine neue Version ist verfügbar. Wollen Sie die Software jetzt aktualisieren?');
      if (confirmed) {
        this.autoUpdater.downloadUpdate();
      }
    });

    this.autoUpdater.on('download-progress', (progressObj) => {
      // tslint:disable-next-line:max-line-length
      console.log(`${progressObj.transferred} of ${progressObj.total} bytes (${progressObj.percent}%, ${progressObj.bytesPerSecond} byte/s)`);
    });

    this.autoUpdater.on('update-downloaded', (info) => {
      const confirmed = confirm('Die aktuellste Version wurde heruntergeladen. Jetzt neu starten?');
      if (confirmed) {
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
  }

  getApplicationVersion() {
    return this.remote.app.getVersion();
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
