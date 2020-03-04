import { Component,EventEmitter, Input, Output,OnInit} from '@angular/core';
declare var BMap:any;
declare var BMAP_ANIMATION_BOUNCE:any;
declare var BMAP_NAVIGATION_CONTROL_SMALL:any,BMAP_ANCHOR_TOP_LEFT:any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  @Input() coordinate:any; //坐标
  @Input() address:any;//已选地址
  @Output() doSoming = new EventEmitter<any>();
  currentCord = '';
  map:any;
  ngOnInit(){
    this.documentClick();
    this.initMap();
  }

  /*點擊其他區域收起*/
  documentClick(){
    document.getElementById('map').onclick = (ev)=>{
      const oEvent = ev || event;
      oEvent.cancelBubble = true;
    };
    document.addEventListener('click',()=>{
      this.doSoming.emit({currentCord:this.currentCord,closed:1});
    })
  }
  /*加載百度地圖*/
  initMap(){
    // 百度地图API功能
    this.map = new BMap.Map("map");
    let point;
    let flag = false;
    let addressFlag = false;
    let city;
    if(!!this.coordinate){
      const cords = this.coordinate.split(',');
      if(cords.length > 1){
        flag = true;
        point = new BMap.Point(cords[0], cords[1])
      }
    }
    if(!flag){
      if(!!this.address){
        const lastAddressIndex = this.address.lastIndexOf('>');
        const firstAddressIndex = this.address.indexOf('>');
        if(lastAddressIndex !== -1 && firstAddressIndex !== -1){
          addressFlag = true;
          const lastAddress = lastAddressIndex !== firstAddressIndex ? this.address.substring(firstAddressIndex + 1,lastAddressIndex) : this.address.substr(0,firstAddressIndex);
          city = lastAddress;
        }
      }
    }
    const intoPoint = flag ? point : (addressFlag ? city : '北京');
    this.map.centerAndZoom(intoPoint, 12);
    this.map.enableDragging();
    this.map.enableScrollWheelZoom(true);
    const navigationControl = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
    this.map.addControl(navigationControl);
    if(flag){
      this.setMap(point);
    }
    const self = this;
    this.map.addEventListener("click",function(e){
      self.currentCord = e.point.lng + "," + e.point.lat;
      self.setMap(new BMap.Point(e.point.lng, e.point.lat));
      self.doSoming.emit({currentCord:self.currentCord,closed:0});
    });
  }
  /*设置标记*/
  setMap(point){
    this.map.clearOverlays();
    const marker = new BMap.Marker(point);
    this.map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
  }
}
