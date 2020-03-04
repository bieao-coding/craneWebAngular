import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class UpdateService {
  baseUrl = 'restful/v1/antiUpgrade';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取工程列表*/
  getProjectList(params): Observable<any>{
    return this.http.get(this.baseUrl + '/projects',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*获取塔机列表*/
  getSoftwareInfoList(projectid,params): Observable<any>{
    return this.http.get(this.baseUrl + '/projects/' + projectid + '/upgradeSoftwareInfo',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*获取版本列表*/
  getVersionList(params): Observable<any>{
    return this.http.get(this.baseUrl +  '/versions',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*获取更新包数据*/
  getRefreshData(projectid,params): Observable<any>{
    return this.http.get(this.baseUrl + '/projects/' + projectid + '/upgradeRate',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
