import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as path from 'path';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { FileSystemError } from '../../../domain/error/FileSystemError';

@Injectable()
export class ExplorerService {

  constructor(private http: HttpClient) { }

  getHomeDirectory(): Observable<string[]> {
    return this.http
      .get<string>(`http://localhost:4201/explorer/homeDirectory`)
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
      let joinedPath = path.join(...pathParts);

      // Workaround: check if we have only a system drive letter, e.g. C: or D:
      // In those cases, path.join() returns the drive letter with a dot: path.join('C:') === 'C:.'
      // Because this name cannot be found, remove the dot.
      // https://github.com/nodejs/node/issues/14405
      if (joinedPath.match(/^[A-Z]{1}:\.$/) !== null) {
        joinedPath = joinedPath.substr(0, 2); // C:. => C:
      }

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
}
