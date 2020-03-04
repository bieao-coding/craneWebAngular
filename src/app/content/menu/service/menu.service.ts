import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class MenuService {
  menuUrl = 'restful/v1/menu';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取单位列表*/
  getMenuList(): Observable<any>{
    return this.http.get(this.menuUrl,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*编辑单位*/
  getSingleMenu(id):Observable<any>{
    return this.http.get(this.menuUrl +'/'+ id,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*新增单位*/
  addMenu(params):Observable<any>{
    return this.http.post(this.menuUrl,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*编辑单位*/
  editMenu(params):Observable<any>{
    return this.http.put(this.menuUrl +'/'+ params.id,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
  /*删除单位*/
  deleteMenu(ids):Observable<any>{
    return this.http.delete(this.menuUrl,{params:{ids:ids},headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
}
