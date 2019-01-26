import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageDto } from '../../../../shared/ImageDto';
import { IImageDto } from '../../../../shared/interface/IImageDto';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  removeImage(image: ImageDto): Observable<IImageDto> {
    if (!image.id) {
      throw new Error(`No id available for removing image`);
    }
    return this.http.delete<ImageDto>(`http://localhost:4201/image/${image.id}`);
  }
}
