import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management.component';
import { ManagementRoutingModule } from './management-routing.module';
import { PersonsListComponent } from './persons-list/persons-list.component';

@NgModule({
  imports: [
    CommonModule,
    ManagementRoutingModule
  ],
  declarations: [
    ManagementComponent,
    PersonsListComponent
  ],
  exports: [
    ManagementComponent
  ]
})
export class ManagementModule { }
