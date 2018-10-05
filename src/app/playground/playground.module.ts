import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    PlaygroundRoutingModule,
    MaterialModule
  ],
  declarations: [
    PlaygroundComponent
  ],
  exports: [
    PlaygroundComponent
  ]
})
export class PlaygroundModule { }
