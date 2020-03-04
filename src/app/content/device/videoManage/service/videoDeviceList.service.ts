import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class VideoDeviceListService {
  deviceUrl = 'restful/v1/videoDevices';
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取设备列表*/
  getDeviceList(params): Observable<any>{
    return this.http.get(this.deviceUrl,{params:params,headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }

  /*新增设备*/
  addDevice(params):Observable<any>{
    return this.http.post(this.deviceUrl,params,{headers:this.headers}).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of(err))
    )
  }
}
