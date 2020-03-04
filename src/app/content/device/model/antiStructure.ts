/*防碰撞参数限制和区域报警参数设置*/
export class AntiStructure {
  slewWarning3: string = '';//转动三速（弧长m）1
  slewWarning: string = ''; //转动二速（弧长m）1
  slewAlarm: string = '';//转动一速（弧长m）1
  minSlewWarning: string = '';//停车角（弧长m）1
  breakSlewWarning: string = '';//刹车角（弧长m）1
  breakDelay: string = '';// 刹车时间（s）1
  radiusWarning: string = '';//幅度高速（m）1
  radiusAlarm: string = '';// 幅度低速（m）1
  minSlewSpeed: string = '';//停车速度（°/s）1

  moveAreaWarning?: string = '';//转角三速(°)1
  moveAreaAlarm?:string = '';//塔机区域移动报警
  slewAreaWarning?: string = '';//转角二速(°)1
  slewAreaAlarm?:string = '';//转角一速(°)1
  radiusAreaWarning?:string = '';//幅度高速(m)1
  radiusAreaAlarm?:string = '';//幅度低速(m)1
  antiSlewSpeed?:string = '';//防碰撞转角速度
  radiusWarning3?:string = '';//幅度预警3速

  moveWarning?:string = '';//塔机移动预警
  moveAlarm?:string = '';// 塔机移动报警

  dummy1?:string = '';
  dummy2?:string = '';
  dummy3?:string = '';
  dummy4?:string = '';
  dummy5?:string = '';
  dummy6?:string = '';

}
