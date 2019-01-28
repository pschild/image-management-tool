import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] && params['currentFolderPath']) {
        const imageId = +params['id'];
        if (imageId && isNaN(imageId)) {
          throw new Error(`Invalid image id in url: ${location.hash}`);
        }
        this.imageService.loadImage(imageId).subscribe(image => {
          console.log('tracked image', image.name + '.' + image.extension, params.currentFolderPath);
        });
      } else if (params['path']) {
        console.log('untracked image', params.path);
      } else {
        throw new Error(`Invalid url: ${location.hash}`);
      }
   });
  }

}
