import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {PublicService} from "../../../utils/public.service";
import {debounceTime, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {CraneModel} from "../model/craneModel";
declare var PIXI:any;
@Component({
  selector:'layout-spread',
  templateUrl:'./cranespread.component.html',
  styleUrls:['./cranespread.component.scss']
})
export class CraneSpreadComponent implements OnInit,OnDestroy{
  maxHeight:number = window.innerHeight - 42 - 40 - 60 - 50;
  beginTime = this.datePipe.transform(new Date(),'yyyy-MM-dd') + ' 00:00:00';
  endTime = this.datePipe.transform(new Date(),'yyyy-MM-dd') + ' 23:59:59';
  searchEvent:HTMLElement;
  projectId:number|string;
  locale:any = {};
  models = [{label:'实时模式',value:0},{label:'历史模式',value:1}];
  playingModel = [{label:'正常播放',value:0},{label:'快速播放',value:1}];
  currentModel = 0;
  currentPlaying = 0;
  playing = true;
  coordinate:Array<any> = [];
  app:any;
  start:any = true;
  data = [];//实时数据
  copyData = [];
  historyData = [];//历史数据
  canvasWidth = 0;
  canvasHeight = 0;
  ele:HTMLElement;
  firstRequest = true;
  cranes = [];
  isEndRequest = false;//判断是否在请求
  currentCrane = null;
  currentId = null;
  historyId = null;
  timeId = null;
  quickPlayId = null;
  historyMaxTime:Date;
  historyMinTime:Date;
  currentTime:Date = new Date();
  showInfo = false;
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,
              private online:OnlineMonitorService,private datePipe:DatePipe,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '塔机分布'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.ele = document.getElementById('container');
    this.canvasWidth = this.ele.offsetWidth -14;
    if(document.getElementById('cloth').clientWidth <= 640){
      this.ele.style.height = this.ele.clientWidth + 'px';
      this.canvasHeight = this.ele.offsetWidth -14;
    }else{
      this.canvasHeight = this.maxHeight - 28 - 14;
    }
    this.localDateComponent();
    this.initCraneSpread();
    this.addEvent();
    this.getList();
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
  /*初始化塔机分布*/
  initCraneSpread(){
    this.app = new PIXI.Application({
      width: this.canvasWidth,
      height: this.canvasHeight,
      antialias: true,
      backgroundColor: 0x141e27,
    });
    this.app.interactive = true;
    this.ele.appendChild(this.app.view);
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
        if(!this.currentModel){
          this.data = res.data;
          this.copyData = JSON.parse(JSON.stringify(this.data));
          this.copyData.length ? this.showInfo = true : this.showInfo = false;
          if(!this.currentCrane){//保证每次请求都更新数据
            this.currentCrane = this.copyData.length ? this.copyData[0] : {};
          }else{
            for(const item of this.copyData){
              if(item.sn === this.currentCrane.sn){
                this.currentCrane = item;
              }
            }
          }
          if(this.firstRequest) {
            this.changeValue();
            this.runTime();
          }
          this.calculate(this.canvasWidth,this.canvasHeight);
        }else{
          this.app.stage.removeChildren();//清楚之前的画布
          this.firstRequest = true;//重新设置第一次请求
          this.historyData = res.data;
          this.resolveHistory();
          this.currentCrane = null;
          this.getTime(this.historyMinTime);
          this.clearTimer();
          this.changeSpeed();
        }
      }
    });
  }
  /*获取更新*/
  refreshParams():Observable<any>{
    if(!this.projectId) return;
    /*实时模式*/
    if(!this.currentModel){
      return this.online.getCraneSpread(this.projectId);
    }else{
      return this.online.getCraneHistory(this.projectId,{beginTime:this.beginTime,endTime:this.endTime});
    }
  }
  /*获取数据*/
  getList(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    if(this.projectId){
      this.isEndRequest = false;
      this.searchEvent.click();
    }
  }
  /*时间走*/
  runTime(){
    this.timeId = setInterval(()=>{
      this.currentTime = new Date();
    },2000)
  }
  /*改变信息*/
  changeValue(){
    this.currentId = setInterval(()=>{
      this.firstRequest = false;
      this.getList();
    },2500);
  }
  /*清楚所有的定时器*/
  clearTimer() {
    if (this.timeId) clearInterval(this.timeId);
    if (this.currentId) clearInterval(this.currentId);
    if (this.historyId) clearInterval(this.historyId);
    if (this.quickPlayId) clearInterval(this.quickPlayId);
  }

  /*将任意坐标系转化为笛卡尔坐标系*/
  translateDecare(){
    for(const item of this.data){
      const newValue = this.pu.translateDecare(item.x,item.y,item.a,item.b,item.rotationAngle);
      item.x = newValue[0];
      item.y = newValue[1];
      item.rotationAngle = newValue[2];
    }
  }
  /*将笛卡尔坐标转化为canvas的坐标*/
  calculate(widthPx,heightPx){
    this.translateDecare();
    let maxX = Number.MIN_VALUE;
    let maxY=  Number.MIN_VALUE;
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for(const item of this.data){
      if(item.x + item.armLength > maxX ){
        maxX = item.x + item.armLength;
      }
      if(item.x - item.armLength < minX){
        minX = item.x - item.armLength;
      }
      if(item.y + item.armLength > maxY){
        maxY = item.y + item.armLength
      }
      if(item.y - item.armLength < minY){
        minY = item.y - item.armLength;
      }
    }
    const width = maxX - minX;
    const height = maxY - minY;
    const ruleX = widthPx/width;
    const ruleY = heightPx/height;

    const scaleMin = ruleX < ruleY ? ruleX:ruleY;

    this.coordinate = [];
    for(const item of this.data){
      const x = Math.round((item.x - minX) * scaleMin);
      const y = Math.round((maxY - item.y) * scaleMin);
      const arm = Math.round(item.armLength * scaleMin - 5);
      const radius = Math.round(item.radius * scaleMin - 5);
      const rotation = Math.round(item.rotationAngle);
      const craneType = item.craneType;
      const name = item.craneNumber;
      this.coordinate.push([x,y,arm,radius,rotation,craneType,name]);
    }
    if(this.firstRequest){
      this.draw2();
      this.update();
      this.animation();
    }else{
      this.update();
    }
  }
  /*画图2*/
  draw2(){
    this.cranes = [];
    for(let i = 0; i < this.coordinate.length; i++){
      const name = new CraneModel();
      name.draw(this.coordinate[i][0],this.coordinate[i][1],this.coordinate[i][2],this.coordinate[i][3] - 5,0,this.coordinate[i][5],this.coordinate[i][6],this.app);
      this.registerEven(name);
      this.cranes.push(name);
    }
  }
  /*更新*/
  update(){
    for(let i = 0; i < this.coordinate.length; i++){
      this.cranes[i].update(this.coordinate[i][0],this.coordinate[i][1],this.coordinate[i][3],this.coordinate[i][4],this.currentPlaying);
    }
  }
  animation(){
    for(let i = 0; i < this.coordinate.length; i++){
      this.cranes[i].animate();
    }
  }
  /*为每一个塔吊注册点击事件*/
  registerEven(item){
    const self = this;
    item.crane.on('pointertap',function(){
      for(const item of self.data){
        if(this.name === item.craneNumber){
          self.currentCrane = item;
        }
      }
    })
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
  /*处理历史数据*/
  resolveHistory(){
    this.historyMaxTime = new Date(this.beginTime);
    this.historyMinTime = new Date(this.endTime);
    const data = this.historyData;
    for(const item in data){
      if(data[item].length){
        if(new Date(data[item][0].recordTime) >= this.historyMaxTime){
          this.historyMaxTime = new Date(data[item][0].recordTime);
        }
        if(new Date(data[item][data[item].length - 1].recordTime) <= this.historyMinTime){
          this.historyMinTime = new Date(data[item][data[item].length - 1].recordTime);
        }
      }
    }
  }
  /*匹配当前的时间点数据*/
  getTime(time){
    this.data = [];
    const data = JSON.parse(JSON.stringify(this.historyData));
    for(const item in data){
      if(!data[item].length) continue;
      let flag = false;
      for(const value of data[item]){
        if(new Date(value.recordTime).getTime() === time.getTime()){
          this.data.push(value);
          flag = true;
        }
      }
      if(!flag) {
        let isExist = false;
        for(const value of this.cranes){
          if(value.crane.name === data[item][0].craneNumber){
            isExist = true;
          }
        }
        if(isExist){
          let flag3 = false;
          for(const value of data[item]){
            if(new Date(value.recordTime).getTime() < time.getTime()){
              flag3 = true;
              this.data.push(value);
              break;
            }
          }
          if(!flag3){
            this.data.push(data[item][data[item].length - 1]);
          }
        }else{
          this.data.push(data[item][data[item].length - 1]);
        }
      }
    }
    /*展示塔机信息*/
    this.copyData = JSON.parse(JSON.stringify(this.data));
    this.copyData.length ? this.showInfo = true : this.showInfo = false;
    if(!this.currentCrane){//保证每次请求都更新数据
      this.currentCrane = this.copyData.length ? this.copyData[0] : {};
    }else{
      for(const item of this.copyData){
        if(item.sn === this.currentCrane.sn){
          this.currentCrane = item;
        }
      }
    }
    this.calculate(this.canvasWidth,this.canvasHeight);
  }
  /*改变速度*/
  changeSpeed(){
    if(this.currentPlaying){
      clearInterval(this.historyId);
      this.quickPlayId = setInterval(()=>{
        this.firstRequest = false;
        if(this.historyMinTime < this.historyMaxTime){
          this.historyMinTime = new Date(this.historyMinTime.getTime() + 1000);
        }else{
          clearInterval(this.quickPlayId);
        }
        this.getTime(this.historyMinTime);
      },1500);
    }else{
      if(this.quickPlayId) clearInterval(this.quickPlayId);
      this.historyId = setInterval(()=>{
        this.firstRequest = false;
        if(this.historyMinTime < this.historyMaxTime){
          this.historyMinTime = new Date(this.historyMinTime.getTime() + 1000);
        }else{
          clearInterval(this.historyId);
        }
        this.getTime(this.historyMinTime);
      },2500);
    }
  }
  /*模式修改*/
  changeModel(){
    this.currentCrane = null;
    this.clearTimer();
    this.cranes = [];
    this.showInfo = false;//清除详情
    this.firstRequest = true;//重新设置第一次请求
    this.currentPlaying = 0;
    this.app.stage.removeChildren();//清楚之前的画布
  }
  /*离开组件是清除定时器*/
  ngOnDestroy(){
    this.clearTimer();
    this.app.ticker.stop();
    this.app.ticker.remove();
  }
}
