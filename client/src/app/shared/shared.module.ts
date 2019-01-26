import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { MaterialModule } from '../material/material.module';
import { ErrorDialogComponent } from './notification/error-dialog/error-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    NotificationComponent,
    ErrorDialogComponent
  ],
  declarations: [
    NotificationComponent,
    ErrorDialogComponent,
    SafeUrlPipe
  ],
  exports: [
    NotificationComponent,
    ErrorDialogComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }
