import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PlaygroundRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    PlaygroundComponent
  ],
  exports: [
    PlaygroundComponent
  ]
})
export class PlaygroundModule { }
