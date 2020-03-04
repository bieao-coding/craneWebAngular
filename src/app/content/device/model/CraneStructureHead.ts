//塔机结构中的塔头
export class CraneStructureHead {
  num: string = '';//塔机编号
  craneType: number = 1; //塔机类型
  xn: string = '';//工地坐标X(°)
  yn: string = '';//工地坐标Y(°)
  length1: string = '';//起重臂(m)
  length2: string = '';//平衡臂(m)
  length3:string = '';//前拉杆距离
  height1: string = '';//塔机高(m)
  height2:string = '';//塔帽高
  defaultAngle: string = '';// 默认角度(°)
  height3: string = '';//配重下垂距离(m)
  height5: string = '';//钢丝绳下垂距离(m)
  height4: string = '';//前桥高(m)
  width1: string = '';//前桥宽(m)
  width2: string = '';//后桥宽(m)
  defaultRadius: string = ''; //默认幅度(m)
  length4: string = '';//标准节边长(m)
  height6: string = '';//标准节高度(m)
  maxLoad: number = 0;//额定起重量(t)
}
