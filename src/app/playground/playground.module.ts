import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { playgroundState } from './playground.state';

@NgModule({
  imports: [
    CommonModule,
    PlaygroundRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxsModule.forFeature(playgroundState)
  ],
  declarations: [
    PlaygroundComponent
  ],
  exports: [
    PlaygroundComponent
  ]
})
export class PlaygroundModule { }
