import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../image.service';
import { of, Observable } from 'rxjs';
import * as path from 'path';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnInit {

  image$: Observable<IImageDto>;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    // TODO: work with NGXS?
    this.image$ = this.route.params.pipe(
      tap((params: Params) => {
        if (!params.absolutePath) {
          throw new Error(`Missing absolutePath in url ${location.hash}`);
        }
      }),
      mergeMap((params: Params, index: number) => {
        if (params.id) {
          return this.imageService.loadImage(params.id);
        } else {
          const extension = path.extname(params.absolutePath);
          const name = path.basename(params.absolutePath, extension);
          return of({ name, absolutePath: params.absolutePath, extension: extension.substring(1) });
        }
      })
    );
  }

}
