import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ImageService } from '../image.service';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss']
})
export class ImageFormComponent implements OnInit {

  @Input() image: IImageDto;

  imageEditForm = this.fb.group({
    place: [''],
    description: [''],
    date: [''],
    tags: this.fb.array([])
  });

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    console.log('loaded image:', this.image);
    this.imageEditForm.patchValue({
      description: this.image.description
    });
  }

  onSubmit() {
    console.log(this.imageEditForm.status);
    console.log(this.imageEditForm.valid);
    console.log(this.imageEditForm.value);
    if (this.imageEditForm.valid) {
      if (this.image.id) {
        // this.imageService.update(this.image.id, this.imageEditForm.value);
        console.log('update', this.image.id, this.imageEditForm.value);
      } else {
        // this.imageService.create(this.imageEditForm.value);
        console.log('create', this.imageEditForm.value);
      }
    }
  }

}
