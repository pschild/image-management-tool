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

  getContentByPath(pathParts: string[]) {
    const joinedPath = path.join(...pathParts);
    const encodedPath = encodeURI(joinedPath);
    return this.http
      .get<IFolderContentDto>(`http://localhost:4201/explorer/path/${encodedPath}`)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(<FileSystemError>errorResponse.error);
        })
      );
  }
}
