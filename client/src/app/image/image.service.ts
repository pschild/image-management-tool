import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageDto } from '../../../../shared/ImageDto';
import { IImageDto } from '../../../../shared/interface/IImageDto';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  loadImage(id: number): Observable<IImageDto> {
    return this.http
      .get<IImageDto>(`${AppConfig.serverBaseUrl}/image/${id}`);
  }

  removeImage(image: ImageDto): Observable<IImageDto> {
    if (!image.id) {
      throw new Error(`No id available for removing image`);
    }
    return this.http.delete<ImageDto>(`${AppConfig.serverBaseUrl}/image/${image.id}`);
  }
}
