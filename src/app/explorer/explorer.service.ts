import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as path from 'path';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FileSystemError } from '../../../domain/error/FileSystemError';

@Injectable()
export class ExplorerService {

  constructor(private http: HttpClient) { }

  getSystemDrives() {
    return this.http
      .get<IFolderContentDto>(`http://localhost:4201/explorer/systemDrives`)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(<FileSystemError>errorResponse.error);
        })
      );
  }

  getContentByPath(pathParts: string[]) {
    let url;
    if (pathParts.length > 0) {
      let joinedPath = path.join(...pathParts);

      // Workaround: check if we have only a system drive letter, e.g. C: or D:
      // In those cases, path.join() returns the drive letter with a dot: path.join('C:') === 'C:.'
      // Because this name cannot be found, remove the dot.
      // https://github.com/nodejs/node/issues/14405
      // In addition, we need to add the path separator (e.g. \)
      if (joinedPath.match(/^[A-Z]{1}:\.$/) !== null) {
        joinedPath = joinedPath.substr(0, 2) + path.sep; // C:. => C:\
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
