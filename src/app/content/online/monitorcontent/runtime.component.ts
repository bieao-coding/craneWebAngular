import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {PublicService} from "../../../utils/public.service";
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "../../../service/message.service";

@Component({
  selector:'layout-time',
  templateUrl:'./runtime.component.html'
})
export class RunTimeComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-46-46-2;
  runTime = [];
  currentData:any = {};
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  now = new Date();
  beginTime;
  endTime;
  searchEvent:HTMLElement;
  projectId:number|string;
  crane:any;
  locale:any = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private message:MessageService,
              private online:OnlineMonitorService,private datePipe:DatePipe,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '运行时间（设备）'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.surePcOrPh();
    this.localDateComponent();
    this.getList();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.isPh = true;
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*本地化日期组件*/
  localDateComponent(){
    this.locale = {
      firstDayOfWeek: 0,
      dayNames: ["一", "二", "三", "四", "五", "六","日"],
      dayNamesShort: ["一", "二", "三", "四", "五", "六","日"],
      dayNamesMin: ["一", "二", "三", "四", "五", "六","日"],
      monthNames: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
      monthNamesShort: [ "一", "二", "三", "四", "五", "六","七", "八", "九", "十", "十一", "十二" ],
      today: '今天',
      clear: '清空'
    };
    this.endTime = new Date();
    this.beginTime = new Date(new Date().setDate(new Date().getDate() - 7));
  }
  /*获取数据*/
  getList(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    this.crane = this.router.snapshot.queryParams;
    if(this.projectId && this.crane){
      const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,beginDate:this.formatter(this.beginTime),endDate:this.formatter(this.endTime)};
      this.online.getCraneRunTime(this.projectId,this.crane['craneId'],params).subscribe((res)=>{
        if(res){
          if(res[0]){
            this.runTime = [];
            this.resolveData(res[0].data.list);
            this.total = res[0].data.total;
          }
          if(res[1]){
            this.currentData = res[1].data;
            this.currentData.runSeconds = this.pu.transSecondsToFormat(this.currentData.runSeconds);
            this.currentData.totalSeconds = this.pu.transSecondsToFormat(this.currentData.totalSeconds);
          }
        }
      });
    }
  }
  /*分页事件*/
  pageChange(event){
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0);
  }
  /*处理数据*/
  resolveData(data){
    for(const item of data){
      const obj = {};
      obj['recordTime'] = item.recordTime;
      obj['endTime'] = this.datePipe.transform(new Date(new Date(item.recordTime).getTime() + 1000 * item.runSeconds),'yyyy-MM-dd HH:mm:ss');
      obj['runTime'] = this.pu.transSecondsToFormat(item.runSeconds);
      this.runTime.push(obj);
    }
  }
  /*格式化时间*/
  formatter(date){
    return this.datePipe.transform(date,'yyyy-MM-dd')
  }
  /*查询*/
  search(){
    this.resolveTime() && this.getList();
  }
  /*处理开始和结束时间*/
  resolveTime() {
    const beginDate = new Date(this.beginTime);
    const endDate = new Date(this.endTime);
    if(beginDate >= endDate){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'开始时间不能大于结束时间！'});
      return false;
    }
    return true;
  }
}
