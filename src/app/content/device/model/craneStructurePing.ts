//塔机结构中的平臂
export class CraneStructurePing {
  num: number = 0;//塔机编号
  craneType: number = 0; //塔机类型
  craneTypeNum:number = 0;//塔机类型clone
  x: number = 0;//工地坐标X(°)
  y: number = 0;//工地坐标Y(°)
  length1: number = 0;//起重臂(m)
  length2: number = 0;//平衡臂(m)
  length3:number = 0;//前拉杆距离
  height1: number = 0;//塔机高(m)
  height2:number = 0;//塔帽高
  height3: number = 0;//配重下垂距离(m)
  height5: number = 0;//钢丝绳下垂距离(m)
  height4: number = 0;//前桥高(m)
  width1: number = 0;//前桥宽(m)
  width2: number = 0;//后桥宽(m)
  defaultAngleNum: number = 0;// 默认角度(°)
  attachDefaultAngle:number = 0;//默认角度(°)
  attachDefaultRadius: number = 0; //默认幅度(m)
  attachDefaultHeight:number = 0;//预留
  attachDummy3:number = 0;//预留
  attachLength4: number = 0;//标准节边长(m)
  attachHeight6: number = 0;//标准节高度(m)
  maxLoad: number = 0;//额定起重量(t)
  attachLength1_1: number = 0;//动臂绞点
}
