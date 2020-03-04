import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Dialog} from "../domain/dialog";

@Injectable()
export class DialogService {
  private dialogSource = new Subject<Dialog>();
  dialogHandler = this.dialogSource.asObservable();

  setDialog(info: Dialog) {
    this.dialogSource.next(info)
  }
}
