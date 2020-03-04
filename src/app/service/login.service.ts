import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  Login(params):Observable<any> {
    return this.http.post('restful/v1/login','username=' + params.userName + '&' + 'password=' + params.password,{headers:{'Content-Type' : 'application/x-www-form-urlencoded'}}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of(err))
    )
  }
  LoginOut():Observable<any> {
    return this.http.post('restful/v1/logout',{}).pipe(
      tap((rep) => rep),
      catchError((err) => Observable.of(err))
    )
  }
}
