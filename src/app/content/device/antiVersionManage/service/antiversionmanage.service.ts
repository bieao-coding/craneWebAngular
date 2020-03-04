import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AntiVersionManageService {
  antiVersionUrl = 'restful/v1/antiVersions';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取设备版本列表*/
  getAntiVersionList(params): Observable<any>{
    return this.http.get(this.antiVersionUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*新增设备版本信息*/
  addAntiVersion(params): Observable<any>{
    return this.http.post(this.antiVersionUrl,params).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*删除设备版本信息*/
  deleteAntiVersion(softwareId): Observable<any>{
    return this.http.delete(this.antiVersionUrl + '/' + softwareId,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
