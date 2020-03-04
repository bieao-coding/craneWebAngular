import {Component, EventEmitter, Input, OnInit, Output,OnDestroy,OnChanges} from '@angular/core';

declare var echarts: any;

@Component({
  selector: 'app-line',
  template:`<div id="line" style="width: 100%;height: 100%;"></div>`
})
export class LineComponent implements OnInit,OnDestroy,OnChanges {
  @Input() data: any;
  @Input() resize: any;
  @Input() lineWidth:any;
  @Input() theme:any;
  myChart: any;
  monthDate = [];
  antiData = [];
  videoData = [];
  timeId = null;
  resizeId = null;
  option:any;
  container:HTMLElement;
  ngOnInit() {
    this.timeId = setTimeout(()=>{
      this.initContainer();
      this.initLine();
    },0)
  }
  ngOnChanges(changes){
    if(changes.resize && changes.resize.previousValue !== undefined){
      if(!changes.resize.currentValue){
        this.container.style.width = this.lineWidth + 'px';
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
        this.option.legend.textStyle.color = '#bac0c0';
        this.option.xAxis.axisLine.lineStyle.color = '#bac0c0';
        this.option.xAxis.axisLabel.textStyle.color = '#bac0c0';
        this.option.yAxis.axisLabel.textStyle.color = '#bac0c0';
        this.option.yAxis.splitLine.lineStyle.color = '#66686b';
      }else{
        this.option.legend.textStyle.color = '#424242';
        this.option.xAxis.axisLine.lineStyle.color = '#424242';
        this.option.xAxis.axisLabel.textStyle.color = '#424242';
        this.option.yAxis.axisLabel.textStyle.color = '#424242';
        this.option.yAxis.splitLine.lineStyle.color = '#b2b4b5';
      }
      this.myChart.setOption(this.option);
    }
  }
  /*初始容器*/
  initContainer() {
    this.container = document.getElementById('line');
    this.container.style.width = this.lineWidth + 'px';
    this.container.style.height = '100%';
    this.myChart = echarts.init(this.container);
    this.resolveData();
  }
  /*处理数据*/
  resolveData(){
    for(const item of this.data){
      this.monthDate.push(item.statsDate);
      this.antiData.push(item.antiOnlineCount);
      this.videoData.push(item.videoOnlineCount);
    }
  }
  /*初始化地图*/
  initLine() {
     this.option = {
      grid: {
        top: '25%',
        left: '1%',
        bottom: '1%',
        right:'1%',
        containLabel: true
      },
      legend: {
        show:true,
        top:'15%',
        data: ['防碰撞', '视频'],
        textStyle: {
          color: this.theme ? '#bac0c0' : '#424242'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: '#290006',
        borderWidth: 1,
        borderColor: '#6a5224',
        padding: 10,
        textStyle: {
          color: '#00d386'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine:{
          lineStyle: {
            color: this.theme ? '#bac0c0' : '#424242'
          }
        },
        axisTick:{
          show:false
        },
        axisLabel: {
          textStyle: {
            color: this.theme ? '#bac0c0' : '#424242'
          }
        },
        data: this.monthDate
      },
      yAxis: {
        type: 'value',
        splitLine:{
          show:true,
          lineStyle:{
            color:this.theme ?  '#66686b' : '#b2b4b5',
            type:'dashed'
          }
        },
        axisTick:{
          show:false
        },
        axisLine:{
         show:false
        },
        axisLabel: {
          textStyle: {
            color: this.theme ? '#bac0c0' : '#424242'
          }
        },
        boundaryGap: [0, '100%']
      },
      // dataZoom: [{
      //   show: true,
      //   realtime: true,
      //   start: 20,
      //   end: 50
      // }, {
      //   type: 'slider',
      //   realtime: true,
      //   start: 20,
      //   end: 50,
      //   borderColor:'#66686b',
      //   dataBackground:{
      //     areaStyle:{
      //       color:'#41b0fa',
      //       opacity:0.1
      //     }
      //   },
      //   textStyle:{
      //     color:'#bac0c0'
      //   }
      // }],
      series: [
        {
          name:'防碰撞',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#916DFC',
              borderWidth:1
            }
          },
          markPoint: {
            itemStyle:{
              color:'#916DFC'
            },
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          areaStyle:{
            color: '#916DFC',
            opacity:0.4
          },
          data: this.antiData
        },
        {
          name:'视频',
          type:'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#367bec',
              borderWidth:1
            }
          },
          markPoint: {
            itemStyle:{
              color:'#367bec'
            },
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          areaStyle:{
            color: '#367bec',
            opacity:0.4
          },
          data: this.videoData
        }
      ]
    };
    this.myChart.setOption(this.option);
  }
  ngOnDestroy(){
    this.myChart.dispose();
    if(this.timeId) clearTimeout(this.timeId);
    if(this.resizeId) clearTimeout(this.resizeId);
  }
}
