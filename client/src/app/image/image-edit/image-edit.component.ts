import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements OnInit {

  fullImagePath$: BehaviorSubject<string> = new BehaviorSubject('');

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
          this.fullImagePath$.next(`${params.currentFolderPath}/${image.name}.${image.extension}`);
        });
      } else if (params['path']) {
        console.log('untracked image', params.path);
        this.fullImagePath$.next(params.path);
      } else {
        throw new Error(`Invalid url: ${location.hash}`);
      }
   });
  }

}
