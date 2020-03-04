import {Component, EventEmitter, Input, OnInit, Output,OnDestroy,OnChanges} from '@angular/core';
declare var echarts:any;
const provinces =  ["北京","天津","上海","重庆","河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南","四川","贵州","云南","陕西","甘肃","青海","内蒙古","广西","西藏","宁夏","新疆","香港","澳门","台湾"];
@Component({
  selector: 'app-china',
  template:`<div id="main"></div>`
})
export class ChinaComponent implements OnInit,OnDestroy,OnChanges{
  @Input() mapName:any;//地图名字
  @Input() mapData:any;//地图的数据
  @Input() citiesData:any;//省份以及地级市的数据(主要用于上颜色)
  @Input() data:any;//城市数据
  @Input() resize:any;//城市数据
  @Output() doSoming = new EventEmitter<any>();
  @Input() mapWidth:any;
  myChart:any;
  clickContent = null;
  resizeId = null;
  container:HTMLElement;
  ngOnInit(){
    this.initContainer();
    this.initMap();
    this.clickMap();
  }
  ngOnChanges(changes){
    if(changes.resize && changes.resize.previousValue !== undefined){
      if(!changes.resize.currentValue){
        this.container.style.width = this.mapWidth + 'px';
      }else{
        this.container.style.width = '100%';
        this.container.style.height = '100%';
      }
      setTimeout(()=>{
        this.myChart.resize();
      },100);
    }
  }
  /*初始容器*/
  initContainer(){
    this.container = document.getElementById('main');
    if(this.resize){
      this.container.style.width = '100%';
    }else{
      this.container.style.width = this.mapWidth + 'px';
    }
    this.container.style.height = '100%';
    this.myChart = echarts.init(this.container);
  }
  /*点击地图下钻*/
  clickMap(){
    const self = this;
    this.myChart.on('click',function(info){
      if(info.seriesType !== 'map') return;
      if(provinces.includes(info.name)){
        self.clickContent = info.name;
      }else{
        self.clickContent = 'china';
      }
      self.doSoming.emit(self.clickContent);
    })
  }
  /*初始化地图*/
  initMap(){
    echarts.registerMap(this.mapName,this.mapData);
    const self = this;
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#290006',
        borderWidth:1,
        borderColor:'#6a5224',
        formatter: function (obj) {
          if(obj.seriesIndex === 1){
            setTimeout(()=>{
              const value = [];
              for(const item of self.data){
                if(item.name === obj.name){
                  value.push(item.value[2]);
                  value.push(item.value[3]);
                }
              }
              try{
                echarts.init(document.getElementById('ebox')).setOption(self.barOpion(value));
              }catch(error){
              }
            },100);
            //重点是这一步，返回一个DIV模型
            return `<div id="ebox" style="width:100px; height:100px;" class="ebox"></div>`
          }
        }
      },
      visualMap: {
        show:false,
        min: 0,
        max: 1000,
        calculable: true,
        seriesIndex:[0],
        inRange: {
          color: ['#b9e292', '#c2e680', '#aadcb2','#d7ef53','#c0e583']
        },
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: this.mapName,
        show: true,
        roam:true,
        zoom:1.2,

        label: {
          normal: {
            show: this.mapName !== 'china',
            color:'rgba(0,0,0,.3)',
            fontWeight:'bold'
          },
          emphasis: {
            show: false,
            color:'rgba(255,255,255,.7)',
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#081734',
            borderColor: '#026093'
          },
          emphasis: {

            areaColor: '#39a3f4',
          }
        }
      },
      series: [
        {
          type: 'map',
          mapType: 'china',
          geoIndex: 0,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          data: this.resolveMapColor()
        },
        {
          name: '点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this.concatValue(),
          symbol: 'pin',
          zlevel: 1,
          symbolSize: function (val) {
            if(val[2] <= 10){
              return val[2]*10;
            }else{
              return 100 + val[2];
            }
          },
          label: {
            normal: {
              formatter:function(val){
                return val.value[2]
              },
              show: true
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: '#916DFC'
            }
          }
        },
        {
          name: '城市',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: this.concatValue(),
          symbolSize: function(val) {
            if(val[2] < 4){
              return 5
            }else if(val[2] < 9){
              return 10
            }else{
              return 15;
            }
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              show: this.mapName !== 'china',
              formatter:'{b}',
              position:'right',
              distance:5,
              color:'#6B565D',
              fontWeight:'bold'
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: '#632C99',
              shadowBlur: 10,
              shadowColor: '#632C99'
            }
          }
        }
      ]
    };
    this.myChart.clear();//防止地图在切换过程中移位
    this.myChart.setOption(option);
  }
  /*合并最后的防碰撞和视频的值*/
  concatValue(){
    const newValue = [];
    for(const item of this.data){
      newValue.push({
        name:item.name,
        value:[item.value[0],item.value[1],item.value[2] + item.value[3]]
      })
    }
    return newValue;
  }
  /*地图颜色的处理*/
  resolveMapColor(){
    const res = [];
    for(const item of this.citiesData){
      if(this.mapName === 'china'){
        res.push({name:item.provinceName,value:this.randomData()})
      }else{
        if(item.provinceName === this.mapName){
          for(const city of item.citys){
            res.push({name:city.citysName,value:this.randomData()})
          }
        }
      }
    }
    return res;
  }
  /*地图颜色的随机值*/
  randomData() {
    return Math.round(Math.random()*1000);
  }
  /*tooltip的配置*/
  barOpion(data) {
    return {
      grid: {
        left: '5',
        right: '0',
        bottom: '0',
        top: 20,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: [
          '防碰撞',
          '视频 ',
        ],
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: "#00c7ff",
            width: 1,
            type: "solid"
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#fff",
          }
        },
      }],
      yAxis: [{
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: "#00c7ff",
            width: 1,
            type: "solid"
          },
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }],
      series: [{
        type: 'bar',
        data: data,
        barWidth: 10, //柱子宽度
        label: {
          show: true,
          position: 'top',
          color: '#fff'
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#00d386' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#0076fc' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            barBorderRadius: 15,
          }
        }
      }]
    }
  }
  ngOnDestroy(){
    this.myChart.dispose();
    if(this.resizeId) clearTimeout(this.resizeId);
  }
}
