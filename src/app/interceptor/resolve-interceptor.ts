import {Injectable} from "@angular/core";
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {LoadingService} from "../service/loading.service";
import {MessageService} from "../service/message.service";
import {Router} from "@angular/router";

@Injectable()
export class ResolveInterceptor implements HttpInterceptor {
  constructor(private loading:LoadingService,private msg:MessageService,private router: Router){}
  intercept(req:HttpRequest<any>,next:HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;
    let loading = true;
    //不需要走拦截器的接口
    const noClothUrl =
    [
      'videoLivePullUrl',
      'realTime',
      'VODPullUrl',
      'projectAreas',
      'assets',
      'deviceStatistics',
      'deviceOfMonth',
      'realTimePeccancies',
      'topPeccancies',
      'topDevices',
      'sideRunData',
      'cranes',
      'upgradeRate'
    ];
    const lastIndex = url.lastIndexOf('/');
    /*过滤非业务请求的拦截*/
    for(const item of noClothUrl){
      const lastUrl = url.substring(lastIndex + 1);
      if(lastUrl.indexOf(item) !== -1 || lastUrl.indexOf('json') !== -1){
        loading = false;
      }
    }
    const reqResolve = req.clone({
    });
    this.loading.setLoading(loading);
    return next.handle(reqResolve).timeout(10000)
      .do((event:HttpEvent<any>)=>{
        if(event instanceof HttpResponse){
          this.errorMessage(event);
          return Observable.of(reqResolve);
        }
      },(err:any)=>{
        if(err instanceof HttpErrorResponse){
          this.errorMessage(err);
          return Observable.throw(err);
        }else{
          this.loading.setLoading(false);
          this.msg.setMsg({severity:'error', summary:'Error Message', detail:'请求超时！'});
        }
      })
  }
  errorMessage(obj){
    this.loading.setLoading(false);
    let message = {};
    if(obj.status === 200 && obj.body.data === null){
      switch(obj.body.status){
        case 0:
          message = {severity:'success', summary:'Success Message', detail:'操作成功！'};
          break;
        case 2:
          message = {severity:'error', summary:'Error Message', detail:'存在相同名称！'};
          break;
        case 3:
          message = {severity:'error', summary:'Error Message', detail:'不能删除已被使用项！'};
          break;
        case 5:
          message = {severity:'error', summary:'Error Message', detail:'塔机不存在！'};
          break;
        case 6:
          message = {severity:'error', summary:'Error Message', detail:'sn不存在！'};
          break;
        case 7:
          message = {severity:'error', summary:'Error Message', detail:'用户不存在！'};
          break;
        case 8:
          message = {severity:'error', summary:'Error Message', detail:'离线！'};
          break;
        case 9:
          message = {severity:'error', summary:'Error Message', detail:'原密码错误！'};
          break;
        case 13:
          message = {severity:'error', summary:'Error Message', detail:'文件！'};
          break;
        default:
          message = {severity:'error', summary:'Error Message', detail:'操作失败！'};
          break;
      }
      this.msg.setMsg(message);
    }else if(obj.status !== 200){
      switch(obj.status){
        case 403:
          message = {severity:'error', summary:'Error Message', detail:'没有权限！'};
          break;
        case 401:
        case 504:
          this.router.navigate(['/empty']);
          break;
        default:
          message = {severity:'error', summary:'Error Message', detail:'操作失败！'};
          break;
      }
      this.msg.setMsg(message);
    }
  }
}
