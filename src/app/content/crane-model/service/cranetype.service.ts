import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CraneTypeService {
  craneUrl = 'restful/v1/craneFactories';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取厂商列表*/
  getFactoryList(params): Observable<any>{
    return this.http.get(this.craneUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*增加厂商*/
  addFactory(params): Observable<any>{
    return this.http.post(this.craneUrl,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*获取单个厂商*/
  getSingleFactory(id:number|string): Observable<any>{
    return this.http.get(this.craneUrl +'/'+ id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑*/
  editFactory(params): Observable<any>{
    return this.http.put(this.craneUrl +'/'+ params.craneFactoryId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*获取厂商型号列表*/
  getFactoryTypes(params): Observable<any>{
    return this.http.get(this.craneUrl +'/' + params.craneFactoryId +'/craneModels',{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*添加型号*/
  addFactoryType(factoryId:number|string,params): Observable<any>{
    return this.http.post(this.craneUrl +'/' + factoryId +'/craneModels',params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*获取的单个型号*/
  getSingleType(factoryId,modelId): Observable<any>{
    return this.http.get(this.craneUrl +'/'+ factoryId + '/craneModels/' + modelId,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑型号*/
  editFactoryType(factoryId,params): Observable<any>{
    return this.http.put(this.craneUrl +'/'+ factoryId + '/craneModels/' + params.craneModelId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
}
