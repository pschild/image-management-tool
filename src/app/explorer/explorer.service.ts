import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as path from 'path';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { FolderDto } from '../../../domain/FolderDto';
import { IFolderDto } from '../../../domain/interface/IFolderDto';

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
          return throwError(<FileSystemError>errorResponse.error);
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
          return throwError(<FileSystemError>errorResponse.error);
        })
      );
  }

  createFolderByPath(folderPath: string): Observable<FolderDto> {
    return this.http.post<FolderDto>(`http://localhost:4201/explorer/folder`, { path: folderPath });
  }

  relocateFolder(oldPath: string, newPath: string): Observable<IFolderDto> {
    return this.http.post<FolderDto>(`http://localhost:4201/explorer/relocate/folder`, { oldPath, newPath });
  }
}
