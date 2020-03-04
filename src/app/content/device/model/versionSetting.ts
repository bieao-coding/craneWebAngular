/*通讯协议版本设置*/
export class VersionSetting {
  sendDelayTime?: string = '';//延迟发送时间(ms)
  proVersionType?: number = 0;//通信协议版本
  commQuality?:string = '';//通讯质量检测周期(s)
}
