import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerComponent } from './explorer.component';
import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerService } from './explorer.service';
import { SharedModule } from '../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { ExplorerState } from './explorer.state';
import { FolderState } from '../folder/folder.state';
import { FolderModule } from '../folder/folder.module';
import { ImageState } from '../image/image.state';
import { ImageModule } from '../image/image.module';

@NgModule({
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    SharedModule,
    FolderModule,
    ImageModule,
    NgxsModule.forFeature([ExplorerState, FolderState, ImageState])
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
