import { Component,EventEmitter, Input, Output,OnInit} from '@angular/core';
declare var BMap:any;
declare var BMAP_ANIMATION_BOUNCE:any;
declare var BMAP_NAVIGATION_CONTROL_SMALL:any,BMAP_ANCHOR_TOP_LEFT:any;
@Component({
  selector: 'app-homeMap',
  template:`<div id="map" style="width: 100%;height: 100%;"></div>`
})
export class HomeMapComponent implements OnInit{
  @Input() data:any;
  @Input() mapType:any;
  map:any;
  point:any = '西安';
  ngOnInit(){
    this.initMap();
  }
  /*加載百度地圖*/
  initMap(){
    // 百度地图API功能
    this.map = new BMap.Map("map");
    this.sureAngle();
    this.map.enableDragging();
    this.map.enableScrollWheelZoom(true);
    const navigationControl = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
    this.map.addControl(navigationControl);
    setTimeout(()=>{
      this.addMarks();
      this.getBoundary();
    },500)
  }
  /*判断视角*/
  sureAngle(){
    let value = 5;
    if(this.mapType !== 'china'){
      this.point = this.mapType;
      value = 6;
    }
    this.map.centerAndZoom(this.point, value);
  }
  /*添加多个点*/
  addMarks() {
    for (const item of this.data) {
      const coordinate = item.projectLocation.split(',');
      const point = new BMap.Point(coordinate[0], coordinate[1]);
      const myIcon = new BMap.Icon("assets/images/map-crane.png", new BMap.Size(51,48));
      const marker = new BMap.Marker(point,{icon:myIcon});
      this.map.addOverlay(marker);
      const content = this.resolveInfo(item);
      marker.addEventListener("click", () => {
        this.map.openInfoWindow(new BMap.InfoWindow(content), point); //开启信息窗口
      });
    }
  }
  /*信息框的内容*/
  resolveInfo(params){
    const content = `
      <div class="baidu-info">
        <ul>
          <li onclick="clickTab(event,0)" class="click-bg">基础信息</li>
          <li onclick="clickTab(event,1)">设备信息</li>
        </ul>
        <table id="baseInfo" cellspacing="0">
          <tr><td>项目名称</td><td>${params.projectName}</td><td>项目地址</td><td>${params.projectAddress}</td></tr>
          <tr><td>工地电话</td><td>${params.telephone}</td><td>施工单位</td><td>${params.workCompany}</td></tr>
          <tr><td>建设单位</td><td>${params.buildCompany}</td><td>监理单位</td><td>${params.supervisionCompany}</td></tr>
        </table>
         <table id="deviceInfo" cellspacing="0">
          <tr><td>塔机总数</td><td>${params.craneCount}</td><td>未安装（防碰撞/视频）</td><td>${params.craneCount - params.antiCount}/${params.craneCount - params.videoCount}</td></tr>
          <tr><td>防碰撞总数</td><td>${params.antiCount}</td><td>防碰撞在线</td><td>${params.antiOnlineCount}</td></tr>
          <tr><td>视频总数</td><td>${params.videoCount}</td><td>视频在线</td><td>${params.videoOnlineCount}</td></tr>
        </table>
      </div>
    `;
    return content;
  }
  /*添加省界*/
  getBoundary(){
    const bdary = new BMap.Boundary();
    const self = this;
    if(this.mapType === 'china') return;
    bdary.get(this.mapType, function(rs){
      const count = rs.boundaries.length;
      if (count === 0) {
        return ;
      }
      for (let i = 0; i < count; i++) {
        const ply = new BMap.Polyline(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#027eff"});
        self.map.addOverlay(ply);
      }
    });
  }
}
