import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management.component';
import { ManagementRoutingModule } from './management-routing.module';
import { TagManagementModule } from './tag-management/tag-management.module';

@NgModule({
  imports: [
    CommonModule,
    ManagementRoutingModule,
    TagManagementModule
  ],
  declarations: [
    ManagementComponent
  ],
  exports: [
    ManagementComponent
  ]
})
export class ManagementModule { }
