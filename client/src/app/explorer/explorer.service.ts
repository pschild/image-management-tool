import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as path from 'path';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AppConfig } from '../../environments/environment';
import { IExplorerContentDto } from '../../../../shared/dto/IExplorerContent.dto';
import { IFolderDto } from '../../../../shared/dto/IFolder.dto';
import { IImageDto } from '../../../../shared/dto/IImage.dto';

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

  getSystemDrives(): Observable<IExplorerContentDto> {
    return this.http
      .get<IExplorerContentDto>(`${AppConfig.serverBaseUrl}/explorer/systemDrives`)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  getContentByPath(pathParts: string[]): Observable<IExplorerContentDto> {
    let url;
    if (pathParts.length > 0) {
      const joinedPath = path.join(...pathParts);
      const encodedPath = encodeURI(joinedPath);
      url = `${AppConfig.serverBaseUrl}/explorer/path/${encodedPath}`;
    } else {
      url = `${AppConfig.serverBaseUrl}/explorer/systemDrives`;
    }

    return this.http
      .get<IExplorerContentDto>(url)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  relocateFolder(oldPath: string, newPath: string): Observable<IFolderDto> {
    return this.http
      .post<IFolderDto>(`${AppConfig.serverBaseUrl}/explorer/relocate/folder`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  relocateImage(oldPath: string, newPath: string): Observable<IImageDto> {
    return this.http
      .post<IImageDto>(`${AppConfig.serverBaseUrl}/explorer/relocate/image`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }
}
