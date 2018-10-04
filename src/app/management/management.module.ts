import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management.component';
import { ManagementRoutingModule } from './management-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ManagementRoutingModule
  ],
  declarations: [
    ManagementComponent
  ],
  exports: [
    ManagementComponent
  ]
})
export class ManagementModule { }
