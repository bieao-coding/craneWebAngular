import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class OnlineMonitorService {
  constructor(private http: HttpClient) {}
  baseUrl = 'restful/v1/dataMonitoring';
  headers = {'Content-Type' : 'application/json'};
  /*获取列表*/
  getList(params): Observable<any>{
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
  /*获取塔机分布实时*/
  getCraneSpread(projectid): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectid + '/cranesDistribution/realTime',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机实时侧视图*/
  getCraneSideView(projectId,craneId): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/sideRunData',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机分布历史*/
  getCraneHistory(projectid,params){
    return this.http.get(this.baseUrl + '/' + projectid + '/cranesDistribution/history',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机运行数据*/
  getCraneRunData(projectId,craneId,params): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/runDataLogs',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机吊重数据*/
  getCraneWorkData(projectId,craneId,params): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/workDataLogs',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机运行时间*/
  getCraneRunTime(projectId,craneId,params): Observable<any>{
    const http1 = this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/runTimeLogs',{params:params,headers:this.headers});
    const http2 = this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/runTime',{params:params,headers:this.headers});
    return Observable.forkJoin(http1,http2).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of())
    )
  }
  /*获取塔机视频运行时间*/
  getCraneVideoRunTime(projectId,craneId,params): Observable<any>{
    const http1 = this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/videoRunTimeLogs',{params:params,headers:this.headers});
    const http2 = this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/videoRunTime',{params:params,headers:this.headers});
    return Observable.forkJoin(http1,http2).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of())
    )
  }
  /*获取塔机视频直播*/
  getCraneLiveVideo(projectId,craneId,params): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' + craneId + '/videoLivePullUrl',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*视频点播*/
  getRecordedVideo(projectId,craneId,params): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' +craneId + '/VODLog',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*播放点播视频*/
  getRecordedVideoSingle(projectId,craneId,params): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' +craneId + '/VODPullUrl',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*刷新视频*/
  refreshVideo(projectId,craneId,sn): Observable<any>{
    return this.http.get(this.baseUrl + '/' + projectId + '/cranes/' +craneId + '/refreshVODLog',{params:{sn:sn},headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
