import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";

@Injectable()
export class LoadingService {
  private loadSource = new Subject<Boolean>();//观察者
  loadHandler = this.loadSource.asObservable();//被观察者

  setLoading(state: Boolean) {
    this.loadSource.next(state)
  }
}
