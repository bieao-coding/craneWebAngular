import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {ActivatedRoute} from "@angular/router";
declare var PIXI:any;
@Component({
  selector:'layout-sidePing',
  templateUrl:'./sideviewPing.component.html',
  styleUrls:['./sideviewPing.component.scss']
})
export class SideViewPingComponent implements OnInit,OnDestroy{
  constructor(private breadcrumbService: BreadcrumbService,private online:OnlineMonitorService,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '塔机侧视图'}
    ]);
  }
  maxHeight:number = window.innerHeight - 112 - 20;
  app:any;
  Application = PIXI.Application;
  loader = PIXI.loader;
  resources = PIXI.loader.resources;
  Sprite = PIXI.Sprite;
  container:HTMLElement;
  canvasWidth:any;
  canvasHeight:any;
  cargo:any;//货物
  car:any;
  hook:any;
  line:any;
  widthMinScale = 0.258;//塔机尾部到驾驶室的占画布的比例
  widthMaxScale = 0.802;//塔机臂头占画布的比例
  heightMinScale = 0.086;//塔机顶到臂下线占画布的比例
  heightMaxScale = 0.985;//塔机底占画布的比例
  widthBeginPosition:any;
  widthEndPosition:any;
  heightBeginPosition:any;
  heightEndPosition:any;
  craneData = {};//塔机的信息
  oldAnimationData = {lineHeight:0,radius:0,loadValue:0};//保存之前的数据
  newAnimationData = {lineHeight:0,radius:0,loadValue:0};//新数据
  armLengthScale:any;//塔机臂的比例尺
  lineScale:any;//塔机比例尺
  floorHeight = 30;//地面的高度
  halfCar = 11;//小车的一半宽度
  halfHook = 8;//挂钩的一半
  hookHeight = 23;//挂钩的本身高度
  projectId:number|string;
  crane:any;
  showInfo = false;
  currentTime:Date = new Date();
  timeId = null;
  carEndMove = 0;
  lineEndMove = 0;
  carMove = 0;
  lineMove = 0;
  lineFlag = false;
  carFlag = false;
  oldCargo = 0;
  cargoValue = 0;
  firstRequest = true;
  sideViewId = null;
  scale = 1;
  /*初始项*/
  ngOnInit(){
    this.initContainer();
    this.getParams();
    this.getList();
    this.runTime();
    this.test();
  }
  test(){
    this.sideViewId = setInterval(()=>{
      this.firstRequest = false;
      this.getList();
    },2500)
  }
  /*请求*/
  getList(){
    this.online.getCraneSideView(this.projectId,this.crane.craneId).subscribe((res)=>{
      if(res) {
        this.craneData = res.data;
        this.showInfo = true;
        if (this.firstRequest) {
          this.calculateScale();
          this.initPiXi();
        }else{
          this.updatePiXi();
        }
      }
    })
  }
  /*获取工程ID和crane*/
  getParams(){
    this.projectId = this.router.snapshot.paramMap.get('projectId');
    this.crane = this.router.snapshot.queryParams;
  }
  /*初始容器*/
  initContainer(){
    this.container = document.getElementById('container');
    this.canvasWidth = 1202;
    this.canvasHeight = 748;
    this.scale = Math.round(((this.container.clientWidth - 14)/ 1202) * 1000) / 1000;
    if(document.getElementById('cloth').clientWidth <= 640){
      this.container.style.height = this.container.clientWidth + 'px';
    }
  }
  /*计算比例*/
  calculateScale(){
    this.widthBeginPosition = this.canvasWidth * this.widthMinScale;
    this.widthEndPosition = this.canvasWidth * this.widthMaxScale;
    this.armLengthScale = (this.widthEndPosition - this.widthBeginPosition)/this.craneData['armLength'];
    this.heightBeginPosition = this.canvasHeight * this.heightMinScale;
    this.heightEndPosition = this.canvasHeight * this.heightMaxScale;
    this.lineScale = (this.heightEndPosition - this.heightBeginPosition)/this.craneData['craneHeight'];
  }

  /*初始塔机侧视图*/
  initPiXi(){
    this.app = new this.Application({
        width: this.canvasWidth,
        height: this.canvasHeight,
        antialias: true,
        transparent: true,
        resolution: 1
      }
    );
    this.container.appendChild(this.app.view);
    this.loader
      .add([
        "../../../assets/images/crane.png",
        "../../../assets/images/line.png",
        "../../../assets/images/cargo.png",
        "../../../assets/images/car.png",
        "../../../assets/images/hook.png",
      ])
    .load(()=>{
      const crane = new this.Sprite(this.resources['../../../assets/images/crane.png'].texture);
      this.line = new this.Sprite(this.resources['../../../assets/images/line.png'].texture);
      this.car = new this.Sprite(this.resources['../../../assets/images/car.png'].texture);
      this.cargo = new this.Sprite(this.resources['../../../assets/images/cargo.png'].texture);
      this.hook = new this.Sprite(this.resources['../../../assets/images/hook.png'].texture);
      this.car.position.set(this.widthBeginPosition + 100,this.heightBeginPosition - 11);
      this.line.position.set(this.car.x + this.halfCar,this.heightBeginPosition + 4);
      this.line.height = 100;
      this.hook.position.set(this.car.x + this.halfHook,this.line.height + this.line.y);//初始位置
      this.cargo.scale.set(0.5,0.5);
      this.cargo.position.set(-100,this.canvasHeight - this.floorHeight - this.cargo.height);//初始位置
      const machine = new PIXI.Container();
      machine.addChild(crane);
      machine.addChild(this.line);
      machine.addChild(this.car);
      machine.addChild(this.cargo);
      machine.addChild(this.hook);
      machine.scale.set(this.scale);
      this.app.stage.addChild(machine);
      this.oldAnimationData = {lineHeight:100,radius:this.widthBeginPosition + 100,loadValue:0};
      this.updatePiXi();
      this.animation();
    });
  }
  /*动画*/
  animation(){
    const self = this;
    this.app.ticker.add(function(delta){
      if(self.lineFlag && self.carFlag){
        self.lineFlag = false;
        self.carFlag = false;
        self.app.ticker.stop();
      }else {
        if (Math.abs(self.carEndMove - self.car.x) <= Math.abs(self.carMove)) {
          self.car.x = self.carEndMove;
          self.line.x = self.carEndMove + self.halfCar;
          self.hook.x = self.carEndMove + self.halfHook;
          self.carFlag = true;
        } else {
          self.car.x += self.carMove;
          self.line.x += self.carMove;
          self.hook.x += self.carMove;
        }
        if (!self.lineFlag) self.lineFlag = false;
        if (Math.abs(self.lineEndMove - self.line.height) <= Math.abs(self.lineMove) || self.lineFlag || !self.lineMove) {
          self.line.height = self.lineEndMove;
          self.hook.y = self.line.y + self.lineEndMove;
          if(!self.carMove){//只有绳子在动
            if(self.cargoValue <= 0){
              self.cargo.position.set(-100, self.canvasHeight - self.floorHeight - self.cargo.height);
            }else{
              self.cargo.x = self.car.x + 1;
              self.cargo.y = self.hook.y + self.hook.height - 1;
            }
          }
          if(!self.lineMove){//只有小车在动
            if(self.carFlag){
              if(self.cargoValue <= 0){
                self.cargo.position.set(-100, self.canvasHeight - self.floorHeight - self.cargo.height);
              }else{
                self.cargo.x = self.car.x  + 1;
                self.cargo.y = self.hook.y + self.hook.height - 1;
              }
            }else{
              if(self.oldCargo > 0){
                if(self.cargoValue <= 0 || self.oldCargo === self.cargoValue){
                  self.cargo.x = self.car.x  + 1;
                  self.cargo.y = self.hook.y + self.hook.height - 1;
                }
              }
            }
          }
          if(self.cargoValue > 0){//存在货物超过地面
            if((self.hook.y + self.hookHeight + self.cargo.height) >= self.heightEndPosition){
              self.line.height = self.heightEndPosition - self.line.y - self.hookHeight - self.cargo.height;
              self.hook.y = self.line.y + self.line.height;
              self.cargo.y = self.hook.y + self.hook.height - 1;
              self.cargo.x = self.car.x  + 1;
            }else if(self.lineMove){
              self.cargo.y = self.hook.y + self.hook.height - 1;
              self.cargo.x = self.car.x  + 1;
            }
          }else{//防止钩子超过地面
            if(Math.abs(self.lineEndMove - self.line.height) <= Math.abs(self.lineMove)){
              self.cargo.position.set(-100, self.canvasHeight - self.floorHeight - self.cargo.height);
            }
            if((self.hook.y + self.hookHeight) >= self.heightEndPosition){
              self.line.height = self.heightEndPosition - self.line.y - self.hookHeight;
              self.hook.y = self.line.y + self.line.height;
            }
          }
          self.lineFlag = true;
        } else if (!self.lineFlag) {
          self.line.height += self.lineMove;
          self.hook.y += self.lineMove;
          if (self.oldCargo > 0) {//原来有货物
            if (self.cargoValue > 0) {//现在有货物
              if (self.lineMove > 0) {//下降状态
                if ((self.hook.y + self.hookHeight + self.cargo.height) >= self.heightEndPosition) {
                  self.lineFlag = true;
                } else {
                  self.cargo.y = self.hook.y + self.hookHeight - 1;
                  self.cargo.x = self.car.x  + 1;
                }
              } else {//上升状态
                if ((self.heightEndPosition - self.hook.y - self.hookHeight) > self.cargo.height) {
                  self.cargo.y = self.hook.y + self.hook.height - 1;
                  self.cargo.x = self.car.x  + 1;
                }
              }
            } else {//现在没有货物
              if ((self.hook.y + self.hookHeight + self.cargo.height) >= self.heightEndPosition) {
                self.cargo.position.set(-100, self.canvasHeight - self.floorHeight - self.cargo.height);//先卸货
                if (self.hook.y + self.hookHeight >= self.heightEndPosition) {
                  self.lineFlag = true;
                }
              } else {
                self.cargo.y = self.hook.y + self.hook.height - 1;
                self.cargo.x = self.car.x  + 1;
              }
            }
          } else {//原来没有货物
            if (self.cargoValue > 0) {//现在有货物
              if (self.lineMove < 0) {//绳子是上升状态
                if ((self.heightEndPosition - self.hook.y - self.hookHeight) > self.cargo.height) {
                  self.cargo.y = self.hook.y + self.hook.height - 1;
                  self.cargo.x = self.car.x  + 1;
                }
              } else {//绳子是下降状态
                if ((self.heightEndPosition - self.hook.y - self.hookHeight) <= self.cargo.height) {
                  self.cargo.y = self.hook.y + self.hook.height - 1;
                  self.cargo.x = self.car.x  + 1;
                  self.lineFlag = true;
                }
              }
            } else {//现在没有货物
              if (self.hook.y + self.hookHeight >= self.heightEndPosition) {
                self.lineFlag = true;
              }
            }
          }
        }
      }
    });
  }
  /*更新*/
  updatePiXi(){
    this.newAnimationData = {lineHeight:this.craneData['height'] * this.lineScale,radius:this.craneData['radius'] * this.armLengthScale + this.widthBeginPosition,loadValue:this.craneData['loadValue']};
    this.carMove = (this.newAnimationData.radius - this.oldAnimationData.radius) / 100;
    this.lineMove = (this.newAnimationData.lineHeight - this.oldAnimationData.lineHeight) / 100;
    this.carEndMove = this.newAnimationData.radius;
    this.lineEndMove = this.newAnimationData.lineHeight;
    this.oldCargo = this.oldAnimationData.loadValue;
    this.cargoValue = this.newAnimationData.loadValue;
    this.lineFlag = false;
    this.carFlag = false;
    this.app.ticker.start();
    this.oldAnimationData = this.newAnimationData;
  }
  /*时间走*/
  runTime(){
    this.timeId = setInterval(()=>{
      this.currentTime = new Date();
    },2000)
  }
  ngOnDestroy(){
    this.loader.loading = false;
    this.loader.progress = 0;
    this.loader.resources = {};
    if(this.timeId) clearInterval(this.timeId);
    this.app.ticker.stop();
    this.app.ticker.remove();
    if(this.sideViewId) clearInterval(this.sideViewId);
  }
}
