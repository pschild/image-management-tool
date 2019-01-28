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
      const imageId = +params['id'];
      if (!imageId || isNaN(imageId)) {
        throw new Error(`Couldn't get image id from active route ${location.hash}`);
      }
      
      this.imageService.loadImage(imageId).subscribe(i => console.log(i));
   });
  }

}
