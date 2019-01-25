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

@Injectable()
export class ExplorerService {

  constructor(private http: HttpClient) { }

  getHomeDirectory(): Observable<string[]> {
    return this.http
      .get(`http://localhost:4201/explorer/homeDirectory`, {responseType: 'text'})
      .pipe(
        map((homeDirectory: string) => homeDirectory.split(path.sep))
      );
  }

  getSystemDrives(): Observable<IFolderContentDto> {
    return this.http
      .get<IFolderContentDto>(`http://localhost:4201/explorer/systemDrives`)
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
      url = `http://localhost:4201/explorer/path/${encodedPath}`;
    } else {
      url = `http://localhost:4201/explorer/systemDrives`;
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
    return this.http.post<FolderDto>(`http://localhost:4201/explorer/folder`, { path: folderPath });
  }

  createImageByPath(absolutePath: string, name: string, extension: string): Observable<ImageDto> {
    return this.http.post<ImageDto>(`http://localhost:4201/explorer/image`, { absolutePath, name, extension });
  }

  relocateFolder(oldPath: string, newPath: string): Observable<IFolderDto> {
    return this.http
      .post<FolderDto>(`http://localhost:4201/explorer/relocate/folder`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  relocateImage(oldPath: string, newPath: string): Observable<IImageDto> {
    return this.http
      .post<ImageDto>(`http://localhost:4201/explorer/relocate/image`, { oldPath, newPath })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
      );
  }

  // TODO: move to FolderService
  removeFolder(folder: FolderDto): Observable<IFolderDto> {
    if (!folder.id) {
      throw new Error(`No id available for removing folder`);
    }
    return this.http.delete<FolderDto>(`http://localhost:4201/folder/${folder.id}`);
  }

  // TODO: move to ImageService
  removeImage(image: ImageDto): Observable<IImageDto> {
    if (!image.id) {
      throw new Error(`No id available for removing image`);
    }
    return this.http.delete<ImageDto>(`http://localhost:4201/image/${image.id}`);
  }
}
