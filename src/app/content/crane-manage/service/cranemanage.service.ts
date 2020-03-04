import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CraneManageService {
  craneUrl = 'restful/v1/craneManager';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取工程列表*/
  getProjectList(params): Observable<any>{
    return this.http.get(this.craneUrl + '/projects',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取塔机列表*/
  getCraneList(id:number|string): Observable<any>{
    return this.http.get(this.craneUrl + '/' + id + '/cranes',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取个体塔机数据*/
  getSingleCrane(state,projectId,craneId?):Observable<any>{
    const http1 = this.http.get(this.craneUrl +'/'+ projectId +'/cranes/craneFactories',{headers:this.headers});
    const http3 = this.http.get(this.craneUrl +'/'+ projectId +'/cranes/usableDevices',{headers:this.headers});
    const http4 = this.http.get(this.craneUrl +'/'+ projectId +'/cranes/usableVideoDevices',{headers:this.headers});
    if(state){
      const http2 = this.http.get(this.craneUrl +'/'+ projectId +'/cranes/'+ craneId,{headers:this.headers});
      return Observable.forkJoin(http1,http3,http4,http2).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )
    }else{

      return Observable.forkJoin(http1,http3,http4).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )
    }
  }
  /*根据厂商选择塔机型号*/
  getFactoryModels(projectid,factoryid):Observable<any>{
    return this.http.get(this.craneUrl + '/' + projectid +'/cranes/craneFactories/' + factoryid + '/craneModels',{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of())
    )
  }
  /*新增塔机*/
  addCrane(id,params):Observable<any>{
    return this.http.post(this.craneUrl + '/' + id + '/cranes',params,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*编辑塔机*/
  editCrane(id,params):Observable<any>{
    return this.http.put(this.craneUrl +'/' + id +'/cranes/'+ params.craneId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }

  /*获取塔基人员列表*/
  getCraneOperatorList(projectId,craneId): Observable<any>{
    return this.http.get(this.craneUrl +'/' + projectId +'/cranes/'+ craneId + '/personals',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*绑定人员*/
  bindOperators(projectId,craneId,params): Observable<any>{
    return this.http.post(this.craneUrl +'/' + projectId +'/cranes/'+ craneId + '/personals',params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*获取打卡记录*/
  getClockRecordList(projectId,craneId,params): Observable<any>{
    return this.http.get(this.craneUrl +'/' + projectId +'/cranes/'+ craneId + '/clockInRecord',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
