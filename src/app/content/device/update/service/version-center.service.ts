import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class VersionCenterService {
  defaultValue = null;
  selected = null;
  centerEventer: EventEmitter<any> = new EventEmitter();
}
