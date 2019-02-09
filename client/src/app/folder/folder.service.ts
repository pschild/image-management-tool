import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { IMergedFolderDto } from '../../../../shared/dto/IMergedFolder.dto';
import { IFolderDto } from '../../../../shared/dto/IFolder.dto';

@Injectable()
export class FolderService {

  constructor(private http: HttpClient) { }

  createByPath(folderPath: string): Observable<IFolderDto> {
    return this.http.post<IFolderDto>(`${AppConfig.serverBaseUrl}/folder/byPath`, { path: folderPath });
  }

  removeFolder(folder: IMergedFolderDto): Observable<void> {
    if (!folder.id) {
      throw new Error(`No id available for removing folder`);
    }
    return this.http.delete<void>(`${AppConfig.serverBaseUrl}/folder/${folder.id}`);
  }
}
