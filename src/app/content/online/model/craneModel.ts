declare var PIXI: any;
const preValue = Math.PI / 180; // 计算弧度制专用
export class CraneModel {
  private radius: number = 0;
  private x:any;
  private y:any;
  private oldRadius: number = 0;
  private rotation: number = 0;
  private craneMove:number = 0;
  private carMove:number = 0;
  private armFlag = false;
  private carFlag = false;
  private app:any;
  private craneType:any;
  private crane = new PIXI.Graphics();//圆+半径
  private car = new PIXI.Graphics();//小车
  private style = {
    fontFamily: 'Arial',
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#39a3f4'], // gradient
    stroke: '#4a1850',
    strokeThickness: 4,
    dropShadow: true,//为文本设置阴影
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 2,
    wordWrap: true,
    wordWrapWidth: 440
  };

  //private firstDraw: boolean = true;
  // update(x: number, y: number, arm: number, radius: number, rotation: number, name: string, speed: number, app: any) {
  //   if (!this.firstDraw) {
  //     this.animation(x, y, radius, rotation, speed, app);
  //   }
  //   if (this.firstDraw) {
  //     this.draw(x, y, arm, radius, rotation, name, app);
  //     this.firstDraw = false;
  //   }
  //   this.x = x;
  //   this.y = y;
  //   this.radius = radius;
  //   this.arm = arm;
  //   this.rotation = this.translateAngle(rotation);
  // }

  /*画图*/
  draw(x: number, y: number, arm: number, radius: number, rotation: number,craneType:number, name: string, app: any) {
    const newRotation = this.translateAngle(rotation);//笛卡尔转canvas坐标新角度
    this.crane.interactive = true; //开启交互
    this.crane.buttonMode = true;//设置指针
    this.crane.cursor = 'pointer';
    this.crane.name = name;
    let width = 2;//塔机臂的宽度
    let circle = 3;//圆心的半径
    let circleLine = 1;//圆心的边宽
    let opcity = 0.5;
    //由于无法再圆绘制完成后更改圆的半径，所以需要在scale时取大概的值以使其不至于差别太大
    if(craneType === 1){
      if(radius >= arm * (3/4)){
        width = 2;
        circle = 3;
        circleLine = 1;
      }else{
        width = 1.3;
        circle = 2.2;
        circleLine = 0.5;
        opcity = 0.7
      }
    }
    this.crane.lineStyle(width, 0xb3b2b2, 1);
    this.crane.moveTo(-10, 0);
    this.crane.lineTo(craneType === 0 ? arm : radius, 0);
    this.crane.endFill();

    this.crane.lineStyle(circleLine, 0xb3b2b2, 1);
    this.crane.beginFill(0xDC143C);
    this.crane.drawCircle(0, 0, circle);
    this.crane.endFill();

    this.crane.lineStyle(circleLine, 0x00ff99, opcity);
    this.crane.beginFill(0, 0);
    this.crane.drawCircle(0, 0, craneType === 0 ? arm : radius);
    this.crane.endFill();
    this.crane.x = x;
    this.crane.y = y;

    this.crane.rotation = preValue * newRotation;
    // //圆心
    // this.title.lineStyle(1, 0xb3b2b2, 1);
    // this.title.beginFill(0xDC143C);
    // this.title.drawCircle(0, 0, 3);
    // this.title.endFill();
    // this.title.x = x;
    // this.title.y = y;
    //小车
    this.car.beginFill(0xDC143C);
    this.car.lineStyle(0);
    this.car.drawCircle(0, 0, 3);
    this.car.endFill();
    this.car.x = x + radius * Math.cos(preValue * newRotation);
    this.car.y = y + radius * Math.sin(preValue * newRotation);

    const richText = new PIXI.Text(name, this.style);
    richText.x = x - 15;
    richText.y = y - 25;
    app.stage.addChild(richText, this.crane, this.car);
    // this.crane.on('mouseover', function (event) {
    //   this.scale.x *= 1.03;
    //   this.scale.y *= 1.03;
    // });
    // this.crane.on('mouseout', function (event) {
    //   this.scale.x = 1;
    //   this.scale.y = 1;
    // });
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = rotation;
    this.oldRadius = radius;
    this.app = app;
    this.craneType = craneType;
  }
  /*动画*/
  animate(){
    const self = this;
    let d = 0;
    let s = 0;
    this.app.ticker.add(function () {
      if(self.armFlag && self.carFlag){
        self.oldRadius = self.radius;
        d = 0;
        s = 0;
        self.armFlag = false;
        self.carFlag = false;
        self.app.ticker.stop();
      }else{
        /*当来回摆动的幅度在增量的范围内时，就表示到位了*/
        const sub1 = Math.round((Math.abs(self.crane.rotation - (preValue * self.rotation))) * 100) / 100;
        const sub2 = Math.round(Math.abs(self.oldRadius + d - self.radius) * 100) / 100;
        // 判断大臂是否到达新的位置，不是就继续移动
        if (sub1 < self.craneMove) {
          self.crane.rotation = preValue * self.rotation;
          self.armFlag = true;
        } else {
          /*处理塔机臂*/
          if (self.crane.rotation > preValue * self.rotation) {
            self.crane.rotation -= self.craneMove;
          } else {
            self.crane.rotation += self.craneMove;
          }
        }
        // 判断小车是否到达新的位置，不是就继续移动
        if (sub2 < self.carMove || (!self.carMove && self.armFlag)) {
          self.car.x = self.x + self.radius * Math.cos(preValue * self.rotation);
          self.car.y = self.y + self.radius * Math.sin(preValue * self.rotation);
          self.carFlag = true;
        } else {
          /*处理小车*/
          if (self.oldRadius + d > self.radius) {
            d -= self.carMove;
            if(self.craneType === 1){
              self.crane.scale.x *= (self.oldRadius + d)/(self.oldRadius + d + self.carMove);
              self.crane.scale.y *= (self.oldRadius + d)/(self.oldRadius + d + self.carMove);
            }
          } else {
            d += self.carMove;
            if(self.craneType === 1){
              self.crane.scale.x *= (self.oldRadius + d)/(self.oldRadius + d - self.carMove);
              self.crane.scale.y *= (self.oldRadius + d)/(self.oldRadius + d - self.carMove);
            }
          }
          self.car.x = self.x + (self.oldRadius + d) * Math.cos(self.crane.rotation);
          self.car.y = self.y + (self.oldRadius + d) * Math.sin(self.crane.rotation);
        }
      }
    })
  }
  /*更新*/
  update(x: number, y: number, radius: number, rotation: number, speed: number) {
    let runSpeed = 110;
    if(speed) runSpeed = 50;
    const newRotation = this.translateAngle(rotation);//笛卡尔转canvas坐标新角度
    const rotateAngle = this.transformMinAngle(newRotation);
    this.craneMove = (preValue * rotateAngle[0]) / runSpeed; // PIXI动画执行的是60次/s
    this.carMove = radius === this.radius ? 0 : Math.abs((radius - this.radius) / runSpeed);// 只有旋转角度时，小车的每次增加值为0
    /*判断如果跨0度的处理*/
    if (rotateAngle[1]) {
      if (this.translateAngle(rotation) > 180) {
        this.crane.rotation = this.crane.rotation + preValue * 360;
      } else {
        this.crane.rotation = this.crane.rotation - preValue * 360;
      }
    }
    this.radius = radius;
    this.rotation = this.translateAngle(rotation);
    this.armFlag = false;
    this.carFlag = false;
    this.app.ticker.start();
    // const animate = function () {
    //   /*当来回摆动的幅度在增量的范围内时，就表示到位了*/
    //   const sub1 = Math.round((Math.abs(self.crane.rotation - (preValue * self.rotation))) * 100) / 100;
    //   const sub2 = Math.round(Math.abs(oldRadius + d - self.radius) * 100) / 100;
    //   // 判断大臂是否到达新的位置，不是就继续移动
    //   if (sub1 < self.craneMove || !self.craneMove) {
    //     self.crane.rotation = preValue * self.rotation;
    //   } else {
    //     /*处理塔机臂*/
    //     if (self.crane.rotation > preValue * self.rotation) {
    //       self.crane.rotation -= self.craneMove;
    //     } else {
    //       self.crane.rotation += self.craneMove;
    //     }
    //   }
    //   // 判断小车是否到达新的位置，不是就继续移动
    //   if (sub2 < self.carMove) {
    //     self.car.x = x + (oldRadius + d) * Math.cos(preValue * self.rotation);
    //     self.car.y = y + (oldRadius + d) * Math.sin(preValue * self.rotation);
    //   } else {
    //     /*处理小车*/
    //     if (oldRadius + d > self.radius) {
    //       d -= self.carMove;
    //     } else {
    //       d += self.carMove;
    //     }
    //     self.car.x = x + (oldRadius + d) * Math.cos(self.crane.rotation);
    //     self.car.y = y + (oldRadius + d) * Math.sin(self.crane.rotation);
    //   }
    // };
    // if(this.ticker) this.ticker.remove(animate);
    // this.ticker = app.ticker.add(animate);
  }

  /*笛卡尔度数转为canvas度数*/
  translateAngle(angle: number) {
    const newAngle = Math.abs(angle) > 360 ? angle % 360 : angle;
    return newAngle <= 0 ? -newAngle : 360 - newAngle;
  }

  /*判断旋转最小角度*/
  transformMinAngle(newAngle: number) {
    const diff = Math.abs(this.rotation - newAngle);
    return [Math.abs(diff <= 180 ? diff : diff - 360), diff <= 180 ? 0 : 1];//0:未过0度，1：过0度
  }
}
