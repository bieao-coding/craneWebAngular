/*区域报警参数设置*/
export class AreaWarning {
  moveAreaWarning?: string = '';//转角三速(°)
  slewAreaWarning?: string = '';//转角二速(°)
  slewAreaAlarm?:string = '';//转角一速(°)
  radiusAreaWarning?:string = '';//幅度高速(m)
  radiusAreaAlarm?:string = '';//幅度低速(m)
}
