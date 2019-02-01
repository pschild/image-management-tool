import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { IImageEntityDto } from '../../../../shared/IImageEntity.dto';
import { IMergedImageDto } from '../../../../shared/IMergedImage.dto';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  loadImage(id: number): Observable<IImageEntityDto> {
    return this.http
      .get<IImageEntityDto>(`${AppConfig.serverBaseUrl}/image/${id}`);
  }

  createByPath(absolutePath: string, name: string, extension: string): Observable<IImageEntityDto> {
    return this.http.post<IImageEntityDto>(`${AppConfig.serverBaseUrl}/image/byPath`, { absolutePath, name, extension });
  }

  removeImage(image: IMergedImageDto): Observable<void> {
    if (!image.id) {
      throw new Error(`No id available for removing image`);
    }
    return this.http.delete<void>(`${AppConfig.serverBaseUrl}/image/${image.id}`);
  }
}
