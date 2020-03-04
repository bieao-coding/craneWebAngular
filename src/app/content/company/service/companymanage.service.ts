import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CompanyManageService {
  companyUrl = 'restful/v1/companies';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取单位列表*/
  getCompanyList(params): Observable<any>{
    return this.http.get(this.companyUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取个体单位*/
  getSingleCompany(id):Observable<any>{
    return this.http.get(this.companyUrl +'/'+ id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*新增单位*/
  addCompany(params):Observable<any>{
    return this.http.post(this.companyUrl,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑单位*/
  editCompany(params):Observable<any>{
    return this.http.put(this.companyUrl +'/'+ params.companyId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
}
