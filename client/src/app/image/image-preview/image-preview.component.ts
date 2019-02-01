import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  @Input() absoluteImagePath: string;

  constructor() { }

  ngOnInit() {
  }

}
