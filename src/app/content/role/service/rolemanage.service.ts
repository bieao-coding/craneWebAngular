import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap,concat } from 'rxjs/operators';

@Injectable()
export class RoleManageService {
  allAuthUrl = this.http.get('restful/v1/authorities');
  roleUrl = 'restful/v1/roles';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取角色列表*/
  getRoleList(params): Observable<any>{
    return this.http.get(this.roleUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*删除角色*/
  delete(id:number|string):Observable<any>{
    return this.http.delete(this.roleUrl + '/' + id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of(err))
    )
  }
  /*新增角色*/
  addRole(params):Observable<any>{
    return this.http.post(this.roleUrl,JSON.stringify(params),{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of(err))
    )
  }

  /*获得编辑的数据*/
  getEditData(id:number|string):Observable<any>{
    return this.http.get(this.roleUrl +'/' + id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑角色*/
  editRole(params):Observable<any>{
    return this.http.put(this.roleUrl+'/' + params.roleId,JSON.stringify(params),{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of(err))
    )
  }
  /*获取个人权限全部裸权限和角色权限*/
  getAllAuth(id):Observable<any>{
    return Observable.forkJoin(this.allAuthUrl,this.http.get(this.roleUrl +'/'+ id + '/authorityIds',{headers:this.headers})).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of())
    )
  }
  /*保存权限*/
  saveAuth(id,params){
    return this.http.put(this.roleUrl +'/'+ id + '/authorities',params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
}
