import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FolderDto } from '../../../../shared/FolderDto';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';

@Injectable()
export class FolderService {

  constructor(private http: HttpClient) { }

  removeFolder(folder: FolderDto): Observable<IFolderDto> {
    if (!folder.id) {
      throw new Error(`No id available for removing folder`);
    }
    return this.http.delete<FolderDto>(`http://localhost:4201/folder/${folder.id}`);
  }
}
