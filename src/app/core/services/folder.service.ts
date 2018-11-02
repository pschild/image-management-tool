import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FolderDto } from '../../../../domain/FolderDto';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  createByPath(path: string): Observable<FolderDto> {
    return this.http.post<FolderDto>(`http://localhost:4201/folder`, { path });
  }
}
