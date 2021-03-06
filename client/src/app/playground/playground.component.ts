import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from '../core/services/electron.service';
import { DialogService } from '../core/services/dialog.service';
import { AppConfig } from '../../environments/environment';
import { MatMenuTrigger } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Select, Store } from '@ngxs/store';
import { AppendBar, FooState } from './playground.state';
import { IDialogResult } from '../shared/dialog/dialog-config';
import { DialogResult } from '../shared/dialog/dialog.enum';
import { ElectronUpdateService } from '../core/services/electron-update.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  croppedImagePaths$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  croppedImagesLoading = false;
  fuzzValue = 6;

  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger }) public contextMenuTrigger: MatMenuTrigger;
  public menuLeft = 0;
  public menuTop = 0;

  applicationVersion: string;
  greetings: string;

  @Select(FooState) foo$: Observable<string>;

  constructor(
    private http: HttpClient,
    private electronService: ElectronService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private store: Store,
    private zone: NgZone,
    private electronUpdateService: ElectronUpdateService
  ) {}

  ngOnInit() {
    this.applicationVersion = this.electronService.getApplicationVersion();

    this.http.get(`${AppConfig.serverBaseUrl}/welcome/greet/philippe`, { responseType: 'text' })
      .subscribe((result: any) => {
        this.greetings = result;
      });

    this.http.get(`${AppConfig.serverBaseUrl}/welcome/dbtest`)
      .subscribe((result: any) => {
        console.log(result);
      });
  }

  openFolderDialog() {
    this.dialogService.showOpenFolderDialog((filePaths: string[], bookmarks: string[]) => {
      console.log(filePaths);
    }, true);
  }

  openFileDialog() {
    this.dialogService.showOpenFileDialog((filePaths: string[], bookmarks: string[]) => {
      if (filePaths && filePaths.length) {
        const chosenFilePath = filePaths[0];

        this.zone.run(() => {
          this.croppedImagesLoading = true;
        });

        this.http.post(`${AppConfig.serverBaseUrl}/welcome/cropImage`, {
          filePath: chosenFilePath,
          fuzzValue: this.fuzzValue
        }).subscribe((result: any) => {
          this.zone.run(() => {
            this.croppedImagesLoading = false;
            this.croppedImagePaths$.next(result.downloadPaths);
          });
        });
      }
    });
  }

  openContextMenu(event) {
    event.preventDefault();
    this.menuLeft = event.x;
    this.menuTop = event.y;
    this.contextMenuTrigger.openMenu();
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  onAppendClick() {
    this.store.dispatch(new AppendBar('baz'));
  }

  testDialog(type: string) {
    if (type === 'notification') {
      this.dialogService.showNotificationDialog({
        title: 'Title',
        message: 'notification'
      }).subscribe((dialogResult: IDialogResult) => console.log(dialogResult));
    } else if (type === 'error') {
      this.dialogService.showErrorDialog({
        title: 'Title',
        message: 'error'
      }).subscribe((dialogResult: IDialogResult) => console.log(dialogResult));
    } else if (type === 'yesno') {
      this.dialogService.showYesNoDialog({
        title: 'Title',
        message: 'yesno'
      }).subscribe((dialogResult: IDialogResult) => {
        switch (dialogResult.result) {
          case DialogResult.YES:
            console.log('pressed yes');
            break;
          case DialogResult.NO:
            console.log('press no');
            break;
          case DialogResult.ABORT:
            console.log('aborted');
            break;
        }
      });
    } else if (type === 'save') {
      this.dialogService.showSaveDialog({
        title: 'Title',
        message: 'save'
      }).subscribe((dialogResult: IDialogResult) => console.log(dialogResult));
    }
  }

}
