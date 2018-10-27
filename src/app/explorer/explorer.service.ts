import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as path from 'path';

@Injectable()
export class ExplorerService {

  constructor(private http: HttpClient) { }

  getContentByPath(pathParts: string[]) {
    const joinedPath = path.join(...pathParts);
    const encodedPath = encodeURI(joinedPath);
    return this.http.get<{ folders: any[], images: any[] }>(`http://localhost:4201/explorer/path/${encodedPath}`); // TODO: put to interface
  }
}
