import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Message} from "primeng/api";

@Injectable()
export class MessageService {
  private messageSource = new Subject<Message>();
  messageHandler = this.messageSource.asObservable();

  setMsg(msg) {
    this.messageSource.next(msg)
  }
}
