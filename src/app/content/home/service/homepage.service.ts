import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HomePageService {
  baseMapUrl = 'assets/json';//城市地理数据
  baseDataUrl = 'restful/v1/index';//数据路径
  headers = {'Content-Type' : 'application/json'};
  constructor(private http: HttpClient) {}
  /*获取地图*/
  getMap(name):Observable<any>{
    return this.http.get(this.baseMapUrl +'/'+ name + '.json',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取地图数据*/
  getMapData():Observable<any>{
    const http1 = this.http.get(this.baseMapUrl +'/cities.json',{headers:this.headers});
    const http2 = this.http.get(this.baseDataUrl +'/projectAreas',{headers:this.headers});
    return Observable.forkJoin(http2,http1).pipe(
      tap((resp)=>resp),
      catchError(err=>Observable.of())
    )
  }
  /*获取到设备的数据*/
  getDevices():Observable<any>{
    return this.http.get(this.baseDataUrl +'/deviceStatistics',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取一个月的在线量*/
  getMonthData():Observable<any>{
    return this.http.get(this.baseDataUrl +'/deviceOfMonth',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取拥有量排名*/
  getNumberTop():Observable<any>{
    return this.http.get(this.baseDataUrl +'/realTimePeccancies',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取违章TOP10排名*/
  getPeccancyCountTop():Observable<any>{
    return this.http.get(this.baseDataUrl +'/topPeccancies',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
  /*获取设备拥有量排名*/
  getTopDevices():Observable<any>{
    return this.http.get(this.baseDataUrl +'/topDevices',{headers:this.headers}).pipe(
      tap((rep) => rep),
      catchError((err)=>Observable.of())
    )
  }
}
