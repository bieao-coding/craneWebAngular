import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ParamsService {
  baseUrl = 'restful/v1/dataMonitoring';
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
  getCraneList(projectid): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectid + '/cranes',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取地址三级json*/
  getAddress(): Observable<any>{
    return this.http.get('assets/json/info.json',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
