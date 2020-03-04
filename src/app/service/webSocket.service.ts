import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {LoadingService} from "./loading.service";
import {MessageService} from "./message.service";

@Injectable()
export class WebSocketService {
  constructor(private load:LoadingService,private message:MessageService){

  }
  private socketSource = new Subject<any>();
  socketHandler = this.socketSource.asObservable();
  ws:WebSocket;
  state = false;
  /*启动webSocket*/
  initWebSocket(url,params){
    this.ws = new WebSocket(url);
    this.ws.onmessage = (res)=> {
      this.load.setLoading(false);
      this.socketSource.next(res.data);
    };
    this.ws.onopen = ()=>{
      this.sendMessage(url,params);
      console.log('链接成功');
    };
    this.ws.onerror = ()=>{
      this.load.setLoading(false);
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'操作失败！'});
      console.log('链接失败');
    };
    this.ws.onclose = (e)=>{
      this.load.setLoading(false);
      console.log('链接关闭');
    };
  }
  /*发送消息*/
  sendMessage(url,message){
    this.load.setLoading(true);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }else{
      this.initWebSocket(url,message);
    }
  }
  /*关闭socket*/
  closeSocket(){
    this.ws.close();
  }
}
