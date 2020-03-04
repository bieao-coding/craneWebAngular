import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {PublicService} from "../../../utils/public.service";
import {debounceTime, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector:'layout-run',
  templateUrl:'./rundata.component.html'
})
export class RunDataComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-46-46-2;
  runData = [];
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  beginTime = this.datePipe.transform(new Date(),'yyyy-MM-dd') + ' 00:00:00';
  endTime = this.datePipe.transform(new Date(),'yyyy-MM-dd') + ' 23:59:59';
  searchEvent:HTMLElement;
  projectId:number|string;
  crane:any;
  locale:any = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,
              private online:OnlineMonitorService,private datePipe:DatePipe,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '运行数据'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.surePcOrPh();
    this.localDateComponent();
    this.addEvent();
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
    }
  }
  /*添加事件防抖处理*/
  addEvent(){
    this.searchEvent = document.getElementById('search');
    const searchEvent = Observable.fromEvent(this.searchEvent,'click').pipe(
      debounceTime(200),
      switchMap((ev)=>this.refreshParams())
    );
    searchEvent.subscribe((res)=>{
      if(res){
        this.runData = res.data.list;
        this.total = res.data.total;
      }
    });
  }
  /*获取更新*/
  refreshParams():Observable<any>{
    if(!this.projectId || !this.crane['craneId']) return;
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,beginTime:this.beginTime,endTime:this.endTime};
    return this.online.getCraneRunData(this.projectId,this.crane['craneId'],params);
  }
  /*获取数据*/
  getList(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    this.crane = this.router.snapshot.queryParams;
    if(this.projectId && this.crane){
      this.searchEvent.click();
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
  /*格式化开始时间*/
  selectBegin(value){
    this.beginTime = this.datePipe.transform(value,'yyyy-MM-dd HH:mm:ss');
    const planMaxEnd = new Date(this.datePipe.transform(value,'yyyy-MM-dd') + ' 23:59:59');
    const planMinEnd = new Date(this.beginTime);
    if(new Date(this.endTime) > planMaxEnd){
      this.endTime = this.datePipe.transform(planMaxEnd,'yyyy-MM-dd HH:mm:ss');
    }
    if(new Date(this.endTime) < planMinEnd){
      this.endTime = this.datePipe.transform(planMinEnd,'yyyy-MM-dd') + ' 23:59:59';
    }
  }
  /*格式化结束时间*/
  selectEnd(value){
    this.endTime = this.datePipe.transform(value,'yyyy-MM-dd HH:mm:ss');
    const planMinBegin = new Date(this.datePipe.transform(value,'yyyy-MM-dd') + ' 00:00:00');
    const planMaxBegin = new Date(this.endTime);
    if(new Date(this.beginTime) < planMinBegin){
      this.beginTime = this.datePipe.transform(planMinBegin,'yyyy-MM-dd HH:mm:ss');
    }
    if(new Date(this.beginTime) > planMaxBegin){
      this.beginTime = this.datePipe.transform(planMaxBegin,'yyyy-MM-dd') + ' 00:00:00';
    }
  }
  /*处理点击显示*/
  tdClick(event){
    if(event.target.classList.contains('hidden-more')) event.target.removeAttribute('class');
    else event.target.setAttribute('class','hidden-more');
  }
}
