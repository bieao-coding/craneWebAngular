import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OnlineMonitorService} from "../service/onlinemonitor.service";
import {ActivatedRoute} from "@angular/router";
declare var PIXI:any;
@Component({
  selector:'layout-sideDong',
  templateUrl:'./sideviewDong.component.html',
  styleUrls:['./sideviewDong.component.scss']
})
export class SideViewDongComponent implements OnInit,OnDestroy{
  constructor(private breadcrumbService: BreadcrumbService,private online:OnlineMonitorService,private router:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '在线监控',routerLink: ['/layout/dataMonitoring']},
      { label: '塔机侧视图'}
    ]);
  }
  maxHeight:number = window.innerHeight - 126;
  app:any;
  Application = PIXI.Application;
  loader = PIXI.loader;
  resources = PIXI.loader.resources;
  Sprite = PIXI.Sprite;
  container:HTMLElement;
  canvasWidth:any;
  canvasHeight:any;
  cargo:any;//货物
  hook:any;//吊钩
  dingLine:any;//顶部卷筒绳子
  line:any;//吊钩绳子
  arm:any;//动臂
  craneData = {};//塔机的信息
  oldAnimationData = {lineHeight:0,rotation:0,loadValue:0};//保存之前的数据
  newAnimationData = {lineHeight:0,rotation:0,loadValue:0};//新数据
  lineScale:any;//塔机比例尺
  projectId:number|string;
  crane:any;
  showInfo = false;
  currentTime:Date = new Date();
  timeId = null;
  armEndMove = 0;
  lineEndMove = 0;
  armMove = 0;//大臂抬起的弧度值
  lineMove = 0;
  lineFlag = false;
  armFlag = false;
  oldCargo = 0;
  cargoValue = 0;
  firstRequest = true;
  sideViewId = null;
  scale = 1;
  preValue = Math.PI / 180;
  armWidth = 514;
  armHeight = 33;
  dingLineX = 127;//塔机顶部卷筒X
  dingLineY = 403;//塔机顶部卷筒Y
  dingLineArmStart = 68;//卷筒到臂的左边的距离
  armLeftBottomX = 195;//下面已经将左下角设置为圆点，这是该点X
  armLeftBottomY = 516;//下面已经将左下角设置为圆点，这是该点Y
  armAngle = 45;//臂的右下角夹角
  armRightSide = 44;//臂的右边的倾斜边的长度
  dingToArmBottom = 110;//顶部卷筒到臂下缘的距离
  pictureHeight = 882;//塔机+臂垂直时的高度
  armBottomToFool = 361;//塔机臂下边到地面的距离
  foolHeight = 8;//底座的高度
  initAngle = 15;//初始角度是15度
  initLineHeight = 100;//初始绳高
  armHookWidth = 10;//大臂上挂钩的宽度
  armHookHeight = 2;//大臂上挂钩的高度
  hookLineOffsetX = 3;//挂钩相对于绳子需要左移的距离
  cargoLineOffsetX = 9;//重物相对于绳子需要左移的距离
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
        // this.craneData =
        //   {
        //   armLength:18,
        //   craneHeight:50,
        //   craneNumber:"TC3",
        //   elevationAngle:10,
        //   height:10,
        //   loadValue:10,
        //   radius:13
        // };
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
    /*14:是div的padding,28:是div的border*/
    this.container = document.getElementById('container');
    this.canvasWidth = this.container.clientWidth - 14;
    this.canvasHeight = this.maxHeight - 28 - 14;
    this.scale = Math.round((this.canvasHeight/ this.pictureHeight) * 1000) / 1000;
    if(document.getElementById('cloth').clientWidth <= 640){//手机端
      this.container.style.height = this.container.clientWidth + 50 + 'px';
      this.canvasHeight = this.container.clientWidth + 50 - 14;
      this.scale = Math.round((this.canvasHeight/ this.pictureHeight) * 1000) / 1000
    }
  }
  /*计算比例*/
  calculateScale(){
    this.lineScale = this.armBottomToFool/this.craneData['craneHeight'];//塔机高度为标准获取 像素/米
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
        "../../../assets/images/craneDong.png",
        "../../../assets/images/dingLine.png",
        "../../../assets/images/arm.png",
        "../../../assets/images/line.png",
        "../../../assets/images/cargo.png",
        "../../../assets/images/hook.png",
      ])
      .load(()=>{
        const crane = new this.Sprite(this.resources['../../../assets/images/craneDong.png'].texture);
        this.dingLine = new this.Sprite(this.resources['../../../assets/images/dingLine.png'].texture);
        this.arm = new this.Sprite(this.resources['../../../assets/images/arm.png'].texture);
        this.line = new this.Sprite(this.resources['../../../assets/images/line.png'].texture);
        this.cargo = new this.Sprite(this.resources['../../../assets/images/cargo.png'].texture);
        this.hook = new this.Sprite(this.resources['../../../assets/images/hook.png'].texture);
        this.line.height = this.initLineHeight;
        crane.position.set(0,this.dingLineY);
        this.arm.position.set(this.armLeftBottomX,this.armLeftBottomY);
        this.arm.anchor.set(0,1);
        this.arm.rotation = -this.preValue * this.initAngle;//初始为0
        /*计算顶部卷筒绳索的x,y方向的值计算需要的绳长以及角度*/
        const self = this;
        const armEndHeight = self.armHeight/Math.cos(-self.arm.rotation);//动臂存在仰角时在臂上的垂直距离
        const rightTopAngle = 90-(180- (90 - this.initAngle) - self.armAngle);//求的右上角的斜边与水平夹角
        const armEndWidth = self.armRightSide * Math.cos(self.preValue * rightTopAngle);//动臂存在仰角时顶部绳结到臂尾的水平距离
        const armNoEndWidth = self.armWidth * Math.cos(-self.arm.rotation) - armEndWidth;//臂左边到顶部绳结的水平距离
        const dingLineWidth = armNoEndWidth + self.dingLineArmStart  + 1;
        const armUpHeight = Math.sin(-self.arm.rotation) * self.armWidth;//臂头抬起的垂直距离
        const armUpWidth = Math.cos(-self.arm.rotation) * self.armWidth;//臂头抬起的水平距离
        const dingLineHeight = self.dingToArmBottom - Math.tan(-self.arm.rotation) * armNoEndWidth - armEndHeight;
        self.dingLine.rotation = Math.atan(dingLineHeight/dingLineWidth);
        self.dingLine.width = Math.sqrt(dingLineWidth * dingLineWidth + dingLineHeight * dingLineHeight);
        //绳子的联动
        self.line.y = self.armLeftBottomY - armUpHeight;
        self.line.x = self.armLeftBottomX + self.armWidth - this.armHookWidth - (self.armWidth - armUpWidth);
        //挂钩
        self.hook.y = self.armLeftBottomY - armUpHeight  + self.line.height;
        self.hook.x = self.armLeftBottomX + self.armWidth - this.armHookWidth - this.hookLineOffsetX - (self.armWidth - armUpWidth);
        this.line.position.set(this.armLeftBottomX + this.armWidth - this.armHookWidth,this.armLeftBottomY - this.armHookHeight);
        this.hook.position.set(this.armLeftBottomX + this.armWidth - this.armHookWidth - this.hookLineOffsetX,this.line.y + this.line.height);
        this.dingLine.position.set(this.dingLineX,this.dingLineY);//塔机顶部卷筒的canvas坐标
        this.cargo.scale.set(0.5,0.5);
        this.cargo.position.set(-100,this.pictureHeight);//初始位置
        const machine = new PIXI.Container();
        machine.addChild(crane);
        machine.addChild(this.arm);
        machine.addChild(this.line);
        machine.addChild(this.dingLine);
        machine.addChild(this.cargo);
        machine.addChild(this.hook);
        machine.scale.set(this.scale);
        this.app.stage.addChild(machine);
        this.oldAnimationData = {lineHeight:this.initLineHeight,rotation:this.initAngle,loadValue:0};//初始值绳长使用像素表示
        this.updatePiXi();
        this.animation();
      });
  }
  /*动画*/
  animation(){
    const self = this;
    this.app.ticker.add(function(delta){
      if(self.armFlag && self.lineFlag){
        self.app.ticker.stop();
        self.armFlag = false;
        self.lineFlag = false;
      }else{
        if(self.arm.rotation < -self.preValue * 80 || self.arm.rotation > -self.preValue * 15){//控制大臂的抬起角度
          self.armFlag = true;
        }else{
          /*当每次角度移动量在单位量之间表示已经到位了*/
          if(Math.abs(self.armEndMove - self.arm.rotation) <= self.armMove){
            self.arm.rotation = self.armEndMove;
            self.armFlag = true;
          }else{
            if(self.arm.rotation > self.armEndMove){
              self.arm.rotation -= self.armMove;
            }else{
              self.arm.rotation += self.armMove;
            }
          }
        }
        /*计算顶部卷筒绳索的x,y方向的值计算需要的绳长以及角度*/
        const armEndHeight = self.armHeight/Math.cos(-self.arm.rotation);//动臂存在仰角时在臂上的垂直距离
        const rightTopAngle = 90-(180-(90 + self.arm.rotation/self.preValue)-self.armAngle);//求的右上角的斜边与水平夹角
        const armEndWidth = self.armRightSide * Math.cos(self.preValue * rightTopAngle);//动臂存在仰角时顶部绳结到臂尾的水平距离
        const armNoEndWidth = self.armWidth * Math.cos(-self.arm.rotation) - armEndWidth;//臂左边到顶部绳结的水平距离
        const dingLineWidth = armNoEndWidth + self.dingLineArmStart  + 1;
        const armUpHeight = Math.sin(-self.arm.rotation) * self.armWidth;//臂头抬起的垂直距离
        const armUpWidth = Math.cos(-self.arm.rotation) * self.armWidth;//臂头抬起的水平距离
        const dingLineHeight = self.dingToArmBottom - Math.tan(-self.arm.rotation) * armNoEndWidth - armEndHeight;
        self.dingLine.rotation = Math.atan(dingLineHeight/dingLineWidth);
        self.dingLine.width = Math.sqrt(dingLineWidth * dingLineWidth + dingLineHeight * dingLineHeight);
        //绳子的联动
        self.line.y = self.armLeftBottomY - armUpHeight;
        self.line.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - (self.armWidth - armUpWidth);
        //挂钩
        self.hook.y = self.armLeftBottomY - armUpHeight  + self.line.height;
        self.hook.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.hookLineOffsetX - (self.armWidth - armUpWidth);
        const dingHookToFool = self.pictureHeight - self.foolHeight - self.line.y;//大臂尾处的挂钩距离地面的距离
        /*处理绳子的变化*/
        if(Math.abs(self.lineEndMove - self.line.height) <= Math.abs(self.lineMove)  || self.lineFlag){
          self.line.height = self.lineEndMove;
          self.hook.y = self.line.y + self.lineEndMove;
          if(self.cargoValue > 0) {//存在货物超过地面
            if ((self.line.height + self.hook.height + self.cargo.height) >= dingHookToFool) {
              self.line.height = dingHookToFool - self.hook.height - self.cargo.height;
              self.hook.y = self.line.y + self.line.height;
              self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
              self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
            } else {
              self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
              self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
            }
          }else{//防止钩子超过地面
            self.cargo.position.set(-100,this.pictureHeight);//卸货
            if((self.line.height + self.hook.height) >= dingHookToFool){
              self.line.height = dingHookToFool - self.hook.height;
              self.hook.y = self.line.y + self.line.height;
            }
          }
          self.lineFlag = true;
        }else if(!self.lineFlag){
          self.line.height += self.lineMove;
          self.hook.y += self.lineMove;
          if(self.oldCargo > 0){//之前存在货物
            if(self.cargoValue > 0){//现在存在货物
              if (self.lineMove > 0) {//下降状态
                if ((self.line.height + self.hook.height + self.cargo.height) >= dingHookToFool) {
                  self.lineFlag = true;
                } else {
                  self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
                  self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
                }
              } else {//上升状态
                if ((dingHookToFool - self.line.height - self.hook.height) > self.cargo.height) {
                  self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
                  self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
                }
              }
            }else{//现在不存在货物
              if ((self.line.height + self.hook.height + self.cargo.height) >= dingHookToFool) {
                self.cargo.position.set(-100,this.pictureHeight);
                if (self.line.height + self.hook.height >= dingHookToFool) {
                  self.lineFlag = true;
                }
              } else {
                self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
                self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
              }
            }
          }else{//之前不存在货物
            if(self.cargoValue > 0){//现在存在货物
              if (self.lineMove < 0) {
                if ((dingHookToFool - self.line.height - self.hook.height) > self.cargo.height) {
                  self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
                  self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
                }
              } else {
                if ((dingHookToFool - self.line.height - self.hook.height) <= self.cargo.height) {
                  self.cargo.y = self.armLeftBottomY - armUpHeight + self.line.height + self.hook.height;
                  self.cargo.x = self.armLeftBottomX + self.armWidth - self.armHookWidth - self.cargoLineOffsetX - (self.armWidth - armUpWidth);
                  self.lineFlag = true;
                }
              }
            }else{//现在不存在货物
              if(self.line.height + self.hook.height >= dingHookToFool){
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
    /*将大臂的抬起角度控制在15~80之间*/
    if(this.craneData['elevationAngle'] >= 80){
      this.craneData['elevationAngle'] = 80;
    }else if(this.craneData['elevationAngle'] <= 15){
      this.craneData['elevationAngle'] = 15;
    }
    this.newAnimationData = {lineHeight:this.craneData['height'] * this.lineScale,rotation:this.craneData['elevationAngle'],loadValue:this.craneData['loadValue']};
    this.armMove = Math.abs((this.newAnimationData.rotation - this.oldAnimationData.rotation) * this.preValue) / 100;
    this.lineMove = (this.newAnimationData.lineHeight - this.oldAnimationData.lineHeight) / 100;
    /*最终到达的目标值*/
    this.armEndMove = -this.newAnimationData.rotation * this.preValue;
    this.lineEndMove = this.newAnimationData.lineHeight;
    /*重物的吊起情况*/
    this.oldCargo = this.oldAnimationData.loadValue;
    this.cargoValue = this.newAnimationData.loadValue;
    this.lineFlag = false;
    this.armFlag = false;
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
