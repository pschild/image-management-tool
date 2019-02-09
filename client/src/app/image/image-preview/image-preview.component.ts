import { Component, OnInit, Input } from '@angular/core';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  @Input() image: IImageDto;

  constructor() { }

  ngOnInit() {
  }

}
