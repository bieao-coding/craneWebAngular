import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {PublicService} from "../../../utils/public.service";
import {MessageService} from "../../../service/message.service";

declare var Aliplayer:any;
@Component({
  selector:'layout-live',
  templateUrl:'./recordedvideo.component.html',
  styleUrls:['./recordedvideo.component.scss']
})
export class RecordedVideoComponent implements OnInit,OnDestroy{
  maxHeight:number = window.innerHeight - 50 - 42 - 40 - 46 - 10 - 64;
  projectId:number|string;
  crane:any;
  noShow = true;
  clickButton = true;
  player:any = null;
  locale:any = {};
  now = new Date();
  allVideo = [];
  selected = {};
  time = 0;
  rangeInfo = {rangeBegin:null,changeBegin:null,rangeEnd:null,data:0,videoType:null};
  searchEvent:HTMLElement;
  disableVideo = true;
  beginTime;
  endTime;
  requestId = null;
  oldUrl = null;
  constructor(private breadcrumbService: BreadcrumbService,private datePipe:DatePipe,private pu:PublicService,private message:MessageService,
              private online:OnlineMonitorService,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '视频点播'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.localDateComponent();
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
    };
    this.beginTime = new Date(new Date().setDate(new Date().getDate() - 1));
    this.endTime = new Date();
  }

  /*获取数据*/
  getList(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    this.crane = this.router.snapshot.queryParams;
    if(this.projectId && this.crane){
      const params = {sn:this.crane.sn,minTime:this.formatter(this.beginTime),maxTime:this.formatter(this.endTime)};
      this.online.getRecordedVideo(this.projectId,this.crane.craneId,params).subscribe((res)=>{
        if(res){
          this.allVideo = this.pu.transformTozTreeFormat({id:'authId',pid:'parentAuthId',children:'children'},res.data);
        }
      });
    }
  }

  /*视频节点被选择时*/
  nodeSelected(event){
    if(event.node){
      this.time = 0;
      const value = event.node;
      const time = value.parentAuthId;
      const seconds = parseInt(value.data);
      const rangeEnd = this.datePipe.transform(new Date(new Date(time).getTime() + 1000 * seconds),'yyyy-MM-dd HH:mm:ss');
      this.disableVideo = false;
      this.rangeInfo.rangeBegin = time;
      this.rangeInfo.changeBegin = time;
      this.rangeInfo.rangeEnd = rangeEnd;
      this.rangeInfo.data = value.data;
      this.rangeInfo.videoType = value.authId;
    }
  }
  /*tab切换事件*/
  tabChange(event) {
    this.hideShow(1);
    if(event.index && this.rangeInfo.data && this.rangeInfo.rangeBegin){
      this.getPullUrl();
      this.replayRequest();
    }
  }
  /*视频拉流*/
  getPullUrl(){
    const params = {sn:this.crane.sn,videoType:this.rangeInfo.videoType,videoName:this.rangeInfo.rangeBegin,timePoint:this.time};
    this.online.getRecordedVideoSingle(this.projectId,this.crane.craneId,params).subscribe((res)=>{
      this.initVideo(res.data.pullUrlAddress);
    })
  }
  /*进度条change事件*/
  showValue(event){
    this.rangeInfo.changeBegin = this.datePipe.transform(new Date(new Date(this.rangeInfo.rangeBegin).getTime() + 1000 * this.time),'yyyy-MM-dd HH:mm:ss');
  }
  /*进度条停止事件*/
  whenEnd(){
    this.hideShow(1);
    this.getPullUrl();
    this.replayRequest();
  }
  /*初始化播放器*/
  initVideo(url){
    if(this.player) {
      if(this.oldUrl === url){
        this.hideShow(0);
        return;
      }else{
        this.hideShow(1);
        this.oldUrl = url;
      }
    }else{
      this.oldUrl = url;
    }
    const self = this;
    try{
      this.player = new Aliplayer({
        id: "video",
        isLive:true,
        source: url,
        autoplay: true,
        width: "99%",
        height: "99%",
        playsinline: true,
        useH5Prism:true,
        useFlashPrism:true,
        controlBarVisibility:"always",
        skinLayout: [
          {
            name: "controlBar", align: "blabs", x: 0, y: 0,
            children: [
              {name:"fullScreenButton", align:"tr", x:10, y: 10}
            ]
          }
        ]
      },function(player){

      });
    }catch(e){

    }
    this.player.on('ready',function(){
      self.hideShow(0);
    });
    this.player.on('error',function(){
      console.log(1);
    });
  }
  /*隐藏加载动画*/
  hideShow(value){
    if(value){
      document.getElementById('loading-before').style.display = 'flex';
    }else{
      document.getElementById('loading-before').style.display = 'none';
    }
  }
  /*刷新*/
  refresh(){
    if(!this.projectId || !this.crane['craneId']) return;
    this.online.refreshVideo(this.projectId,this.crane['craneId'],this.crane['sn']).subscribe();
  }
  /*30秒请求请求一次*/
  replayRequest(){
    if(this.requestId) clearInterval(this.requestId);
    this.requestId = setInterval(()=>{
      this.getPullUrl();
    },30000)
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

  /*销毁定时器*/
  ngOnDestroy(){
    if(this.requestId) clearInterval(this.requestId);
  }
}
