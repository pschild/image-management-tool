import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NotificationComponent,
    SafeUrlPipe
  ],
  exports: [
    NotificationComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }
