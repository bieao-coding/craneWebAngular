import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class VideoVersionManageService {
  videoVersionUrl = 'restful/v1/videoVersions';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取视频版本列表*/
  getVideoVersionList(params): Observable<any>{
    return this.http.get(this.videoVersionUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*新增视频版本信息*/
  addVideoVersion(params): Observable<any>{
    return this.http.post(this.videoVersionUrl,params).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*删除视频版本信息*/
  deleteVideoVersion(versionName): Observable<any>{
    return this.http.delete(this.videoVersionUrl + '/' + versionName,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
