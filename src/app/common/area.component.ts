import { Component,EventEmitter, Input, Output,OnInit} from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit{
  @Input() areas:Array<any>;//省市县json
  @Output() doSoming = new EventEmitter<any>();

  province = [];
  cities = [];
  country = [];
  currentProvince = null;
  currentCity = null;
  address = '';
  isSpecial = false;
  ngOnInit(){
    this.documentClick();
    this.getProvinces();
  }
  /*获取所有省份*/
  getProvinces(){
    this.cities = [];
    this.country = [];
    if(this.areas && this.areas.length){
      for(const item of this.areas){
        this.province.push(item);
      }
    }
  }
  /*获取所有城市*/
  getCities(ev,province){
    const oEvent = ev || event;
    oEvent.cancelBubble = true;
    this.cities = [];
    this.country = [];
    this.currentProvince = province.name;
    this.isSpecial = false;
    if(province && province.city.length > 1){
      this.cities = province.city;
    }else{
      this.isSpecial = true;
      this.cities = province.city[0].area;
    }
  }
  /*获取所有区县*/
  getCountries(ev,city){
    const oEvent = ev || event;
    oEvent.cancelBubble = true;
    this.country = [];
    this.currentCity = city.name;
    if(city){
      this.country = city.area;
    }
  }
  /*返回所选值*/
  chooseAddress(country){
    this.address = this.currentProvince + (this.currentCity ? '>' + this.currentCity : '')  +'>'+ country;
    this.doSoming.emit(this.address);
  }
  /*收起下拉框*/
  upAddress(){
    this.doSoming.emit(this.address);
  }
  /*點擊其他區域收起*/
  documentClick(){
    document.onclick = ()=>{
      this.doSoming.emit(this.address);
    }
  }

}
