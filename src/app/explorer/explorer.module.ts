import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerComponent } from './explorer.component';
import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerService } from './explorer.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    SharedModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ],
  providers: [
    ExplorerService // cannot be provided by providedIn property due to Circular dependency warning
  ]
})
export class ExplorerModule { }
