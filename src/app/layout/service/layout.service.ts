import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LayoutService {
  baseUrl = 'restful/v1/userPageAuth/platform';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取权限列表*/
  getAuthAndMenu(): Observable<any>{
    return this.http.get(this.baseUrl,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of())
    )
  }
}
