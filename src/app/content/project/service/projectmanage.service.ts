import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ProjectManageService {
  projectUrl = 'restful/v1/projects';
  workUrl = 'restful/v1/projects/workCompanies';//施工单位
  buildUrl = 'restful/v1/projects/buildCompanies';//建设单位
  supervisionUrl = 'restful/v1/projects/supervisionCompanies';//监理单位
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取工程列表*/
  getProjectList(params): Observable<any>{
    return this.http.get(this.projectUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*获取个体工程*/
  getSingleProject(state,id?):Observable<any>{
    const http1 = this.http.get(this.workUrl,{headers:this.headers});
    const http2 = this.http.get(this.buildUrl,{headers:this.headers});
    const http3 = this.http.get(this.supervisionUrl,{headers:this.headers});
    const http5 = this.http.get('assets/json/info.json',{headers:this.headers});
    if(state){
      const http4 = this.http.get(this.projectUrl +'/'+ id,{headers:this.headers});
      return Observable.forkJoin(http1,http2,http3,http4,http5).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )
    }else{
      return Observable.forkJoin(http1,http2,http3,http5).pipe(
        tap((resp)=>resp),
        catchError(err=>Observable.of())
      )
    }
  }
  /*新增工程*/
  addProject(params):Observable<any>{
    return this.http.post(this.projectUrl,params,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
  /*编辑工程*/
  editProject(params):Observable<any>{
    return this.http.put(this.projectUrl +'/'+ params.projectId,params,{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of(err))
    )
  }
}
