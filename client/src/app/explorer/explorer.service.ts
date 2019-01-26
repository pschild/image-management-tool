import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as path from 'path';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { IFolderContentDto } from '../../../../shared/interface/IFolderContentDto';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';
import { IImageDto } from '../../../../shared/interface/IImageDto';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ExplorerService {

  constructor(private http: HttpClient) { }

  getHomeDirectory(): Observable<string[]> {
    return this.http
      .get(`${AppConfig.serverBaseUrl}/explorer/homeDirectory`, {responseType: 'text'})
      .pipe(
        map((homeDirectory: string) => homeDirectory.split(path.sep))
      );
  }

  getSystemDrives(): Observable<IFolderContentDto> {
    return this.http
      .get<IFolderContentDto>(`${AppConfig.serverBaseUrl}/explorer/systemDrives`)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  getContentByPath(pathParts: string[]): Observable<IFolderContentDto> {
    let url;
    if (pathParts.length > 0) {
      const joinedPath = path.join(...pathParts);
      const encodedPath = encodeURI(joinedPath);
      url = `${AppConfig.serverBaseUrl}/explorer/path/${encodedPath}`;
    } else {
      url = `${AppConfig.serverBaseUrl}/explorer/systemDrives`;
    }

    return this.http
      .get<IFolderContentDto>(url)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  createFolderByPath(folderPath: string): Observable<FolderDto> {
    return this.http.post<FolderDto>(`${AppConfig.serverBaseUrl}/explorer/folder`, { path: folderPath });
  }

  createImageByPath(absolutePath: string, name: string, extension: string): Observable<ImageDto> {
    return this.http.post<ImageDto>(`${AppConfig.serverBaseUrl}/explorer/image`, { absolutePath, name, extension });
  }

  relocateFolder(oldPath: string, newPath: string): Observable<IFolderDto> {
    return this.http
      .post<FolderDto>(`${AppConfig.serverBaseUrl}/explorer/relocate/folder`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  relocateImage(oldPath: string, newPath: string): Observable<IImageDto> {
    return this.http
      .post<ImageDto>(`${AppConfig.serverBaseUrl}/explorer/relocate/image`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }
}
