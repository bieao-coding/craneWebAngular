//塔机结构中的平臂
export class CraneStructurePingTwo {
  craneNumber: number = 0;//塔机编号
  craneType: number = 0; //塔机类型
  isChange: number = 0;
  relative: number = 0;
  x: number = 0;//工地坐标X(°)
  y: number = 0;//工地坐标Y(°)
  l1: number = 0;//起重臂(m)
  l2: number = 0;//平衡臂(m)
  l3:number = 0;//前拉杆距离
  h1: number = 0;//塔机高(m)
  h2:number = 0;//塔帽高
  h3: number = 0;//配重下垂距离(m)
  h5: number = 0;//钢丝绳下垂距离(m)
  h4: number = 0;//前桥高(m)
  k1: number = 0;//前桥宽(m)
  k2: number = 0;//后桥宽(m)
  defaultAngle: number = 0;// 默认角度(°)
  defaultRadius: number = 0; //默认幅度(m)
  l4: number = 0;//标准节边长(m)
  h6: number = 0;//标准节高度(m)
}
