/*力矩风速参数限制*/
export class TorqueAndWind {
  loadPeccancy: number = 0;//力限制违章百分比
  loadAlarm: number = 0; //力限制报警百分比
  loadWarning: number = 0;// 力限制预警百分比
  torquePeccancy: number = 0;// 力矩百分比1
  torqueAlarm: number = 0;//力矩百分比2
  torqueWarning: number = 0;// 力矩百分比3
  windAlarm: number = 0;//风速报警
  windWarning: number = 0;// 风速预警
}
