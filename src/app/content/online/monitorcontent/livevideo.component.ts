import {Component,OnInit,OnDestroy} from "@angular/core";
import {BreadcrumbService} from "../../../service/breadcrumb.service";
import {ActivatedRoute} from "@angular/router";
import {OnlineMonitorService} from "../service/onlinemonitor.service";
declare var Aliplayer:any;
@Component({
  selector:'layout-live',
  templateUrl:'./livevideo.component.html',
  styleUrls:['./livevideo.component.scss']
})
export class LiveVideoComponent implements OnInit,OnDestroy{
  maxHeight:number = window.innerHeight - 42 - 40 - 50 - 48;
  projectId:number|string;
  crane:any;
  setIntervalId:any;
  player:any = null;
  clickButton = false;
  currentButton:any;
  oldUrl = null;
  constructor(private breadcrumbService: BreadcrumbService,
              private online:OnlineMonitorService,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '视频直播'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.initData();
  }
  /*初始化数据*/
  initData(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    this.crane = this.router.snapshot.queryParams;
  }
  /*获取数据*/
  getList(value){
    if(this.projectId && this.crane){
      this.online.getCraneLiveVideo(this.projectId,this.crane.craneId,{sn:this.crane.sn,videoType:value}).subscribe((res)=>{
        if(res){
          this.initVideo(res.data.pullUrlAddress);
        }
      })
    }
  }
  /*初始化播放器*/
  initVideo(url){
    if(this.player) {
      if(this.oldUrl === url){
        return;
      }else{
        this.hideShow(1);
        this.oldUrl = url;
      }
    }else{
      this.oldUrl = url;
    }
    const self = this;
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
    this.player.on('ready',function(){
      self.hideShow(0);
    });
    this.player.on('error',function(){
      console.log(1);
    });
  }
  /*连续请求*/
  moreRequest(url){
    if(this.player){
      this.player.source = url;
    }
  }
  /*点击事件*/
  click(value){
    if(!value) return;
    this.hideShow(1);
    this.player = null;
    this.clickButton = true;
    this.currentButton = value;
    if(this.setIntervalId) clearInterval(this.setIntervalId);
    this.getList(value);
    this.setIntervalId = setInterval(()=>{
      this.getList(value);
    },30000);
  }
  /*控制遮罩的显示和隐藏(onShow没起作用，暂时这样做)*/
  hideShow(value){
    if(value){
      document.getElementById('loading-before').style.display = 'flex';
    }else{
      document.getElementById('loading-before').style.display = 'none';
    }
  }
  /*销毁定时器*/
  ngOnDestroy(){
    if(this.setIntervalId) clearInterval(this.setIntervalId);
  }
}
