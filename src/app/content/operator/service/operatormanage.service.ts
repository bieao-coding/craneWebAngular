import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class OperatorManageService {
  operatorUrl = 'restful/v1/personals';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取人员列表*/
  getOperatorList(params): Observable<any>{
    return this.http.get(this.operatorUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取个体单位*/
  getSingleOperator(id):Observable<any>{
    return this.http.get(this.operatorUrl +'/'+ id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*新增人员*/
  addOperator(params):Observable<any>{
    return this.http.post(this.operatorUrl,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑人员*/
  editOperator(params):Observable<any>{
    return this.http.put(this.operatorUrl +'/'+ params.personalId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }

  /*删除人员*/
  deleteOperator(params):Observable<any>{
    return this.http.delete(this.operatorUrl +'/'+ params.personalId,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }

  /*获取特征*/
  getOperatorFeature(idCard):Observable<any>{
    return this.http.get(this.operatorUrl +'/'+ idCard + '/features',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
