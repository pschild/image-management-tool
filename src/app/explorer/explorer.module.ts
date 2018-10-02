import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerComponent } from './explorer.component';
import { ExplorerRoutingModule } from './explorer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ExplorerRoutingModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerModule { }
