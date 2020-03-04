/*塔机限位参数限制*/
export class CraneAlarmAndWarning {
  inWarning: string = '';//塔机内限位预警
  inAlarm: string = ''; //塔机内限位报警
  outWarning: string = '';//塔机外限位预警
  outAlarm: string = '';//塔机外限位报警
  upWarning: string = '';//塔机上限位预警
  upAlarm: string = '';//塔机上限位报警
  downWarning: string = '';// 塔机下限位预警
  downAlarm: string = '';// 塔机下限位报警
  corotationWarning: string = '';//塔机正转预警
  corotationAlarm: string = '';//塔机正转报警
  reverseWarning: string = '';// 塔机反转预警
  reverseAlarm: string = '';//前桥宽(m)
}
