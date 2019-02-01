import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { IMergedFolderDto } from '../../../../shared/IMergedFolder.dto';
import { IFolderEntityDto } from '../../../../shared/IFolderEntity.dto';

@Injectable()
export class FolderService {

  constructor(private http: HttpClient) { }

  createByPath(folderPath: string): Observable<IFolderEntityDto> {
    return this.http.post<IFolderEntityDto>(`${AppConfig.serverBaseUrl}/folder/byPath`, { path: folderPath });
  }

  removeFolder(folder: IMergedFolderDto): Observable<void> {
    if (!folder.id) {
      throw new Error(`No id available for removing folder`);
    }
    return this.http.delete<void>(`${AppConfig.serverBaseUrl}/folder/${folder.id}`);
  }
}
