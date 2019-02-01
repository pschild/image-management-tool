import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';
import { BehaviorSubject } from 'rxjs';
import { IImageEntityDto } from '../../../../../shared/IImageEntity.dto';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnInit {

  absoluteImagePath: string;
  image$: BehaviorSubject<IImageEntityDto> = new BehaviorSubject(null);

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
        this.imageService.loadImage(imageId).subscribe((image: IImageEntityDto) => {
          this.image$.next(image);
        });
      }
   });
  }

}
