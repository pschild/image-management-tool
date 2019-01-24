import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [
    SettingsComponent
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
