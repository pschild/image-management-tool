import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ITagDto } from '../../../../../shared/dto/ITag.dto';
import { AppConfig } from '../../../environments/environment';

@Injectable()
export class TagService {

  constructor(private http: HttpClient) { }

  loadAll(): Observable<ITagDto[]> {
    return this.http.get<ITagDto[]>(`${AppConfig.serverBaseUrl}/tag`);
  }

  create(label: string): Observable<ITagDto> {
    return this.http.post<ITagDto>(`${AppConfig.serverBaseUrl}/tag`, { label }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return throwError(errorResponse.error);
      })
    );
  }
}
