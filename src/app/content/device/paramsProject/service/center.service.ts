import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CenterService {
  defaultValue = [];//草稿数组存放临时数据
  selfCrane = [];//本塔机的数据
  currentValue;//编辑或新增的数据
  isEdit = false;
  responseMark = '';
  responseInfo = {state:0,time:''};
  isRead:boolean = false;//读取的参数才可以编辑
  usedNum = [];//已经被使用了的塔机编号
  centerEventer: EventEmitter<any> = new EventEmitter();
}
