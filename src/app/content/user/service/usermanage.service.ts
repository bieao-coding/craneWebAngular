import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class UserManageService {
  constructor(private http: HttpClient) {}
  baseUrl = 'restful/v1/users';
  rolesUrl = 'restful/v1/users/roles';
  companyUrl = 'restful/v1/users/companies';
  projectUrl = 'restful/v1/users/projects';
  headers = {'Content-Type' : 'application/json'};
  /*获取列表*/
  getList(state,params): Observable<any>{
    const users = this.http.get(this.baseUrl,{params:params,headers:this.headers});
    if(state){
      const roles = this.http.get(this.rolesUrl);
      return Observable.forkJoin(users,roles).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )}else{
      return Observable.forkJoin(users).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )}

  }

  /*添加*/
  addUser(params): Observable<any>{
    return this.http.post(this.baseUrl,params,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*编辑*/
  editUser(params): Observable<any>{
    return this.http.put(this.baseUrl +'/' +params.userId,params,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*获取单个用户*/
  getSingleUser(state,id?:number|string):Observable<any>{
    const roles = this.http.get(this.rolesUrl,{headers:this.headers});
    const companies =  this.http.get(this.companyUrl,{headers:this.headers});
    if(state){
      const preUser = this.http.get(this.baseUrl + '/' + id,{headers:this.headers});
      return Observable.forkJoin(roles,companies,preUser).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of()))
    }else {
      return Observable.forkJoin(roles,companies).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of()))
    }
  }
  /*删除*/
  delete(id:number|string):Observable<any>{
    return this.http.delete(this.baseUrl +'/'+ id,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*获取工程列表*/
  getProjectList(id,params):Observable<any>{
    const preUser = this.http.get(this.baseUrl + '/' + id,{headers:this.headers});
    const projects = this.http.get(this.projectUrl,{params:params,headers:this.headers});
    return Observable.forkJoin(preUser,projects).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of())
    )
  }
  /*密码重置*/
  resetPassword(id:number|string){
    return this.http.put(this.baseUrl +'/' + id +'/resetPassword',id,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*校验原密码*/
  checkOldPassword(params):Observable<any>{
    return this.http.get(this.baseUrl +'/'+ params.userId + '/password',{params:{password:params.password},headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*修改密码*/
  modifyPassword(params):Observable<any>{
    return this.http.put(this.baseUrl +'/'+ params.userId + '/password',{password:params.password},{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
}
