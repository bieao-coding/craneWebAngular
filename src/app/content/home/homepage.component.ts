import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {HomePageService} from "./service/homepage.service";
import {DatePipe} from "@angular/common";
import {BarOption} from "./model/bar-option";
import {LayoutComponent} from "../../layout/layout.component";
import {Router} from "@angular/router";
import {FullScreenService} from "../../service/fullScreen.service";
import {ThemeChangeService} from "../../service/theme-change.service";
import {CraneInfo} from "./model/craneInfo";

declare var echarts:any;
@Component({
  selector:'layout-home',
  templateUrl:'./homepage.component.html',
  styleUrls:['./home.component.scss']
})
export class HomePageComponent implements OnInit,OnDestroy{
  maxHeight:number = window.innerHeight-86-40;
  requestData = [];
  citiesData = [];
  mapData:any;
  mapName = null;
  oldMapData = null;
  container:HTMLElement;
  showMap:boolean = false;
  showPie:boolean = false;
  showLine:boolean = false;
  showBar:boolean = false;
  showRate:boolean = false;
  onlineData = [];
  offlineData = [];
  rateData = [];
  deviceInfo:CraneInfo = {};
  monthInfo = [];
  current:any = '';
  barOption = {};
  currentBarData = [];//实时违章
  actualTop = [];//违章TOP10
  devicesTop = [];//设备量TOP10
  barState = true;
  subTheme:any;
  currentTheme:any = false;
  timeId = null;
  resize = false;
  selectModel = 'simple';
  mapWidth = 0;
  centerWidth = 0;
  pieWidth = 0;
  pieHeight = 0;
  lineWidth = 0;
  barWidth = 0;
  topId = null;
  isPh = false;
  constructor(private breadcrumbService: BreadcrumbService,private home:HomePageService,private screen:FullScreenService,private theme:ThemeChangeService,
              private date:DatePipe,private app:LayoutComponent,private router:Router){
    this.subTheme = this.theme.themeHandler.subscribe((theme)=>{
      setTimeout(() => {this.currentTheme = theme});
    });
    this.breadcrumbService.setItems([
      { label: '首页' },
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.isDarkTheme();
    this.noFullScreen();
    this.listenWindowSize();
    this.getList();
    this.getDevices();
    this.getMonthData();
    this.clickItem('actual');
  }
  /*判断是哪个主题*/
  isDarkTheme(){
    const link:HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    this.currentTheme = (link.href.substring(link.href.lastIndexOf('/') + 1, link.href.lastIndexOf('.')).split('-')[1]) === 'dark';
  }
  /*监听窗口变化*/
  listenWindowSize(){
    window.onresize = (e)=>{
      this.maxHeight = document.documentElement.clientHeight;
      if(window.screen.height !== this.maxHeight && !this.isPh){
        this.maxHeight = this.maxHeight-50-42-40;
        this.app.onMenuButtonClick(e,0);
        this.resize = false;
      }else if(!this.isPh){
        this.resize = true;
      }
    }
  }
  /*手机不显示全屏按钮*/
  noFullScreen(){
    if(document.documentElement.clientWidth <= 640){
      this.isPh = true;
      this.screen.setScreen(false);
    }else{
      this.screen.setScreen(true);
    }
  }
  /*实时违章的定时器*/
  intervalRealActual(){
     this.timeId = setInterval(()=>{
       this.getRealActualAjax().subscribe((res)=>{
         this.currentBarData = res.data.slice(0,10).reverse();
       });
       this.resolveData('projectName','peccancyCount','#f53d3d','#f68989',this.currentBarData);
       this.barState = !this.barState;
     },2000)
  }
  /*Top的违章量*/
  intervalTop(){
    this.topId = setInterval(()=>{
      this.getActualTopAjax().subscribe((res)=>{
        this.actualTop = res.data.slice(0,10).reverse();
      });
      this.resolveData('projectName','peccancyCount','#027eff','rgba(17, 168,171, 1)',this.actualTop);
      this.barState = !this.barState;
    },2000)
  }
  /*获取在线量*/
  getDevices(){
    this.home.getDevices().subscribe((res)=>{
      if(res){
        const data = res['data'];
        this.centerWidth = document.getElementById('top-center').clientWidth - 2;
        this.pieWidth = document.getElementById('top-right').clientWidth - 2;
        this.pieHeight = document.getElementById('top-right').clientHeight / 2 - 1;
        this.getDeviceInfo(data);
      }
    })
  }
  /*获取一个月的在线量*/
  getMonthData() {
    this.home.getMonthData().subscribe((res) => {
      if (res) {
        // const now = new Date();
        // const data = [];
        // now.setMonth(now.getMonth() - 1);
        // for(let i = 1; i < 31; i++){
        //   const info  ={};
        //   info['statsDate'] = this.date.transform(now.setDate(now.getDate() + 1),'yyyy-MM-dd');
        //   info['antiOnlineCount'] = i + Math.round(Math.random() * 100);
        //   info['videoOnlineCount'] = i + Math.round(Math.random() * 150);
        //   data.push(info);
        // }
        const data = [];
        for(const item of res.data){
          const info  ={};
          info['statsDate'] = item.statsDate;
          info['antiOnlineCount'] = item.antiOnlineCount;
          info['videoOnlineCount'] = item.videoOnlineCount;
          data.push(info);
        }
        this.monthInfo = data;
        this.lineWidth = document.getElementById('bottom-left').clientWidth - 2;
        this.showLine = true;
      }
    })
  }
  /*获取项目拥有量top10*/
  getProjectNumber(){
    this.home.getTopDevices().subscribe((res)=>{
      if(res){
        // res.data = [
        //   {projectName:'深圳星河ICO一期9',deviceCount:10},
        //   {projectName:'广州龙城铭园改造',deviceCount:10},
        //   {projectName:'南京金泰商业广场',deviceCount:10},
        //   {projectName:'陕西茶张新村改迁',deviceCount:5},
        //   {projectName:'深圳星河ICO一期8',deviceCount:7},
        //   {projectName:'广州龙城铭园改造',deviceCount:8},
        //   {projectName:'南京金泰商业广场',deviceCount:10},
        //   {projectName:'陕西茶张新村改迁',deviceCount:5},
        //   {projectName:'深圳星河ICO一期7',deviceCount:6},
        // ];
        this.devicesTop = res.data.slice(0,10).reverse();
        this.resolveData('projectName','deviceCount','#39a3f4','#5ab7ff',this.devicesTop);
        this.showBar = true;
      }
    })
  }
  /*实时ajax*/
  getRealActualAjax(){
    return this.home.getNumberTop();
  }
  /*实时违章量*/
  getRealActual(){
    this.getRealActualAjax().subscribe((res)=>{
      if(res){
        // res.data = [
        //   {projectName:'深圳星河ICO一期9',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'南京金泰商业广场',peccancyCount:5},
        //   {projectName:'陕西茶张新村改迁',peccancyCount:25},
        //   {projectName:'深圳星河ICO一期8',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'深圳星河ICO一期9',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'南京金泰商业广场',peccancyCount:5},
        //   {projectName:'陕西茶张新村改迁',peccancyCount:25},
        //   {projectName:'深圳星河ICO一期8',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        // ];
        this.currentBarData = res.data.slice(0,10).reverse();
        this.resolveData('projectName','peccancyCount','#f53d3d','#f68989',this.currentBarData);
        this.barWidth = document.getElementById('bottom-right').clientWidth - 20;
        this.showBar = true;
      }
    })
  }
  /*违章ajax*/
  getActualTopAjax(){
    return this.home.getPeccancyCountTop();
  }
  /*违章TOP*/
  getActualTop(){
    this.getActualTopAjax().subscribe((res)=>{
      if(res){
        // res.data = [
        //   {projectName:'深圳星河ICO一期9',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'南京金泰商业广场',peccancyCount:5},
        //   {projectName:'陕西茶张新村改迁',peccancyCount:25},
        //   {projectName:'深圳星河ICO一期8',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'深圳星河ICO一期9',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        //   {projectName:'南京金泰商业广场',peccancyCount:5},
        //   {projectName:'陕西茶张新村改迁',peccancyCount:25},
        //   {projectName:'深圳星河ICO一期8',peccancyCount:50},
        //   {projectName:'广州龙城铭园改造',peccancyCount:20},
        // ];
        this.actualTop = res.data.slice(0,10).reverse();
        this.resolveData('projectName','peccancyCount','#f53d3d','#f68989',this.actualTop);
        this.showBar = true;
      }
    })
  }
  /*获取地图数据*/
  getList(){
    this.home.getMapData().subscribe((data)=>{
      if(data){
        this.oldMapData = data[0].data;
        this.loadWhichMap(this.oldMapData);
        this.transData(this.oldMapData);
        this.citiesData = data[1];
        this.mapWidth = document.getElementById('top-left').clientWidth - 2;
        this.loadMap();
      }
    });
  }
  /*加载map*/
  loadMap() {
    this.home.getMap(this.mapName).subscribe((data)=>{
      if(data){
        this.mapData = data;
        this.showMap = true;
      }
    })
  }
  /*加载哪一个地图*/
  loadWhichMap(data){
    let flag = true;
    let firstAddress = '';
    if(!!data.length){
      firstAddress = data[0].projectAddress;
      for(let i = 0; i < data.length; i++){
        const address = data[i].projectAddress;
        if(address.split('>')[0] !== firstAddress.split('>')[0]) {
          flag = false;
        }
      }
    }else{//不存在工程
      flag = false;
    }
    if(flag){
      this.mapName = firstAddress.split('>')[0];
    }else{
      this.mapName = 'china';
    }
  }
  /*有地图组件传过来的加载项*/
  loadClickMap(content){
    this.mapName = content;
    this.showMap = false;
    this.transData(this.oldMapData);
    this.loadMap();
  }
  /*将原始数据转化为map用数据*/
  transData(data){
    this.requestData = [];
    for(const item of data){
      let name,value = [];
      const address = item.projectAddress;
      const len = address.split('>').length;
      if(len === 2){
        if(this.mapName === 'china'){
          name = address.split('>')[1] ;
        }else{
          if(address.split('>')[0].indexOf(this.mapName) !== -1){
            name = address.split('>')[1];
          }else{
            continue;
          }
        }
      }else if(len > 2){
        if(this.mapName === 'china'){
          name = address.split('>')[2];
        }else{
          if(address.split('>')[0].indexOf(this.mapName) !== -1){
            name = address.split('>')[2];
          }else{
            continue;
          }
        }
      }
      value = item.projectLocation.split(',');
      value.push(item.antiCount);
      value.push(item.videoCount);
      this.requestData.push({name:name,value:value});
    }
  }
  /*处理设备信息*/
  getDeviceInfo(data){
    /*在线率用*/
    this.onlineData.push(data.antiOnlineCount);
    this.onlineData.push(data.antiOfflineCount);
    this.onlineData.push(data.antiOnlineRate);
    this.offlineData.push(data.videoOnlineCount);
    this.offlineData.push(data.videoOfflineCount);
    this.offlineData.push(data.videoOnlineRate);
    /*设备信息用*/
    this.deviceInfo['craneCount'] = data.craneCount;
    this.deviceInfo['addCraneCount'] = data.addCraneCount;
    this.deviceInfo['antiOnlineCount'] = data.antiOnlineCount;
    this.deviceInfo['videoOnlineCount'] = data.videoOnlineCount;
    this.deviceInfo['alarmCount'] = data.alarmCount;
    this.deviceInfo['peccancyCount'] = data.peccancyCount;
    /*扇形用*/
    this.rateData = [{name:'防碰撞在线',value:data.antiOnlineCount},{name:'防碰撞离线',value:data.antiOfflineCount},{name:'视频在线',value:data.videoOnlineCount},{name:'视频离线',value:data.videoOfflineCount}];
    this.showPie = true;
    this.showRate = true;
  }
  /*点击事件*/
  clickItem(item){
    this.current = item;
    this.showBar = false;
    if(item === 'actual'){
      if(this.topId) clearInterval(this.topId);
      this.getRealActual();
      this.intervalRealActual();
    }else if(item === 'history'){
      if(this.timeId) clearInterval(this.timeId);
      this.getActualTop();
      this.intervalTop();
    }else{
      if(this.timeId) clearInterval(this.timeId);
      if(this.topId) clearInterval(this.topId);
      this.getProjectNumber();
    }
  }
  /*处理柱状图的数据*/
  /*处理数据*/
  resolveData(name,value,color0,color1,data){
    const newName = [];
    const newValue = [];
    const newMax = [];
    let maxValue = Number.MIN_VALUE;
    for(const item of data){
      if(item[value] > maxValue){
        maxValue = item[value];
      }
      newName.push(item[name]);
      newValue.push(item[value]);
    }
    for(let i = 0; i < newName.length; i++){
      newMax.push(100);
    }
    this.barOption = new BarOption().setBarOption(newName,color0,color1,newValue,newMax,this.currentTheme);
  }
  /*选择模式*/
  clickModel(model){
    this.selectModel = model;
  }
  ngOnDestroy(){
    if(this.timeId) clearInterval(this.timeId);
    if(this.topId) clearInterval(this.topId);
    window.onresize = null;
    this.screen.setScreen(false);
    if (this.subTheme) {
      this.subTheme.unsubscribe();
    }
  }
}
