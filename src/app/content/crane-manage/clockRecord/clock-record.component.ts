import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {CraneManageService} from "../service/cranemanage.service";
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "../../../service/message.service";

@Component({
  selector:'layout-clock',
  templateUrl:'./clock-record.component.html'
})
export class ClockRecordComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-46-46-2;
  records = [];
  searchValue = '';
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  now = new Date();
  beginTime;
  endTime;
  searchEvent:HTMLElement;
  projectId:number|string;
  craneId:any;
  locale:any = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private messageService:MessageService,
              private craneService:CraneManageService,private datePipe:DatePipe,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '塔机管理' , routerLink: ['/layout/craneManager']},
      { label: `打卡记录` }
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
    this.projectId = this.router.snapshot.paramMap.get('id');
    this.craneId = this.router.snapshot.paramMap.get('craneId');
    if(this.projectId && this.craneId){
      const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,beginTime:this.formatter(this.beginTime),endTime:this.formatter(this.endTime),search:this.searchValue};
      this.craneService.getClockRecordList(this.projectId,this.craneId,params).subscribe((res)=>{
        if(res){
          this.records = res.data.list;
          this.total = res.data.total;
        }
      });
    }
  }
  /*格式化时间*/
  formatter(date){
    return this.datePipe.transform(date,'yyyy-MM-dd HH:mm:ss')
  }
  /*分页事件*/
  pageChange(event){
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0);
  }
  search(){
    this.resolveTime() && this.getList();
  }
  /*处理开始和结束时间*/
  resolveTime() {
    const beginDate = new Date(this.beginTime);
    const endDate = new Date(this.endTime);
    if(beginDate >= endDate){
      this.messageService.setMsg({severity:'error', summary:'Error Message', detail:'开始时间不能大于结束时间！'});
      return false;
    }
    if(new Date(beginDate.setMonth(beginDate.getMonth() + 1)) < endDate){
      this.messageService.setMsg({severity:'error', summary:'Error Message', detail:'查询时间不能大于一个月！'});
      return false;
    }
    return true;
  }
}
