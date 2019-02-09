import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { IMergedImageDto } from '../../../../shared/dto/IMergedImage.dto';
import { IImageDto } from '../../../../shared/dto/IImage.dto';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  loadImage(id: number): Observable<IImageDto> {
    return this.http
      .get<IImageDto>(`${AppConfig.serverBaseUrl}/image/${id}`);
  }

  createByPath(absolutePath: string, name: string, extension: string): Observable<IImageDto> {
    return this.http.post<IImageDto>(`${AppConfig.serverBaseUrl}/image/byPath`, { absolutePath, name, extension });
  }

  removeImage(image: IMergedImageDto): Observable<void> {
    if (!image.id) {
      throw new Error(`No id available for removing image`);
    }
    return this.http.delete<void>(`${AppConfig.serverBaseUrl}/image/${image.id}`);
  }
}
