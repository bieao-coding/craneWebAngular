//塔机结构中的动臂
export class CraneStructureDong {
  num: string = '';//塔机编号
  craneType: number = 2; //塔机类型
  x: string = '';//工地坐标X(°)
  y: string = '';//工地坐标Y(°)
  length1: string = '';//起重臂(m)
  length2: string = '';//平衡臂(m)
  height1: string = '';//塔机高(m)
  height2: string = '';//塔帽高
  defaultAngleNum: string = '';// 默认角度(°)
  height4: string = '';//前桥高(m)
  width1: string = '';//前桥宽(m)
  width2: string = '';//后桥宽(m)
  attachDefaultRadius: string = ''; //默认幅度(m)
  attachLength4: string = '';//标准节边长(m)
  attachHeight6: string = '';//标准节高度(m)
  maxLoad: number = 0;//额定起重量(t)
  attachLength1_1: string = '';//动臂绞点
}
