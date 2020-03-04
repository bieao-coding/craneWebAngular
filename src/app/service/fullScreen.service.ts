import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
@Injectable()
export class FullScreenService {
  private screenSource = new Subject<any>();
  screenHandler = this.screenSource.asObservable();

  setScreen(state) {
    this.screenSource.next(state);
  }
}
