import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';
import { BehaviorSubject } from 'rxjs';
import * as path from 'path';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnInit {

  absoluteImagePath: string;
  image$: BehaviorSubject<IImageDto> = new BehaviorSubject(null);

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params['absolutePath']) {
        throw new Error(`Missing absolutePath in url ${location.hash}`);
      }
      this.absoluteImagePath = params['absolutePath'];

      if (params['id']) {
        const imageId = +params['id'];
        if (imageId && isNaN(imageId)) {
          throw new Error(`Invalid image id in url ${location.hash}`);
        }
        this.imageService.loadImage(imageId).subscribe((image: IImageDto) => {
          this.image$.next(image);
        });
      } else {
        const extension = path.extname(this.absoluteImagePath);
        const name = path.basename(this.absoluteImagePath, extension);
        this.image$.next({
          name,
          absolutePath: this.absoluteImagePath,
          extension: extension.substring(1)
        });
      }
   });
  }

}
