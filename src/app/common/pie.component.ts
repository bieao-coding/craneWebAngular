import {Component, EventEmitter, Input, OnInit, Output,OnDestroy,OnChanges} from '@angular/core';

declare var echarts: any;

@Component({
  selector: 'app-pie',
  template:`<div id ="{{id}}"></div>`
})
export class PieComponent implements OnInit,OnDestroy,OnChanges {
  @Input() data: any;
  @Input() id: any;
  @Input() resize:any;
  @Input() pieWidth:any;
  @Input() pieHeight:any;
  @Input() theme:any;
  myChart: any;
  option:any;
  resizeId = null;
  container:HTMLElement;
  ngOnInit() {
    setTimeout(()=>{
      this.initContainer();
      this.initBall();
    },0)
  }
  ngOnChanges(changes){
    if(changes.resize && changes.resize.previousValue !== undefined){
      if(!changes.resize.currentValue){
        this.container.style.width = this.pieWidth + 'px';
        this.container.style.height = this.pieHeight + 'px';
      }else{
        this.container.style.width = '100%';
        this.container.style.height = '100%';
      }
      setTimeout(()=>{
        this.myChart.resize();
      },100);
    }
    if(changes.theme && changes.theme.previousValue !== undefined){
      if(changes.theme.currentValue){
        this.option.color = '#324a61';
      }else{
        this.option.color = '#d3e6fb';
      }
      this.myChart.setOption(this.option);
    }
  }
  /*初始容器*/
  initContainer() {
    this.container = document.getElementById(this.id);
    this.container.style.width = this.pieWidth + 'px';
    this.container.style.height = this.pieHeight + 'px';
    this.myChart = echarts.init(this.container);
  }

  /*初始化地图*/
  initBall() {
    const self = this;
    const params = this.chooseColor();
    this.option = {
      title: {
        text: params['rate'],
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#0580f2',
          fontSize: '36'
        }
      },
      grid: {
        top: '25%',
        left: '1%',
        bottom: '1%',
        right:'1%',
        containLabel: true
      },
      color: this.theme ? '#324a61' : '#d3e6fb',
      series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['50%', '66%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        hoverAnimation: false,
        data: [
          {
            value:  params['online'],
            name: '01',
            itemStyle: {
              normal: {
                color: {
                  colorStops: [{
                    offset: 0,
                    color: params.color0
                  }, {
                    offset: 1,
                    color: params.color1
                  }]
                },
              }
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          {
            name: '02',
            value: params['offline']
          }
        ]
      }]
    };
    this.myChart.setOption(this.option);
  }
  chooseColor(){
    const obj = {name:'防碰撞在线率',color0:'#d7ef53',color1:'#dfef8b'};
    if(this.id === 'video'){
      obj.name = '视频在线率';
      obj.color0 = '#367bec';
      obj.color1 = '#00cefc';
    }
    obj['online'] = this.data[0] = 10;
    obj['offline'] = this.data[1] = 5;
    obj['rate'] = Math.round(parseFloat(this.data[2]) * 100) + '%';
    return obj;
  }
  ngOnDestroy(){
    this.myChart.dispose();
    if(this.resizeId) clearTimeout(this.resizeId);
  }
}
