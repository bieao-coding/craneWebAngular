import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
@Injectable()
export class ThemeChangeService {
  private themeSource = new Subject<boolean>();
  themeHandler = this.themeSource.asObservable();

  setTheme(state) {
    this.themeSource.next(state);
  }
}
