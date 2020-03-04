import { Component,EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent{
  @Input() message:string;
  @Input() showDialog:Boolean;
  @Output() doSoming = new EventEmitter<boolean>();

  closeDialog(){
    this.showDialog = false;
    this.doSoming.emit(false);//每一个操作都要执行，标识是否执行函数
  }
  doSure(){
    this.doSoming.emit(true);
    this.showDialog = false;
  }
}
