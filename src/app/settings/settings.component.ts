import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from '../core/services/electron.service';
import { AppConfig } from '../../environments/environment';
import { DialogService } from '../core/services/dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  applicationVersion: string;
  greetings: string;

  constructor(private http: HttpClient, private electronService: ElectronService, private dialogService: DialogService) { }

  ngOnInit() {
    this.applicationVersion = this.electronService.getApplicationVersion();

    this.http.get(`${AppConfig.serverBaseUrl}/welcome/philippe`)
      .subscribe((args) => {
        this.greetings = args.toString();
      });
  }

  openDialog() {
    this.dialogService.selectedFilePaths.subscribe(x => console.log(x));
    this.dialogService.showOpenFolderDialog(true);
  }

}
