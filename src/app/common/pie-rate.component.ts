import {Component, EventEmitter, Input, OnInit, Output,OnDestroy,OnChanges} from '@angular/core';

declare var echarts: any;

@Component({
  selector: 'app-rate',
  template:`<div id="rate"></div>`
})
export class PieRateComponent implements OnInit,OnDestroy,OnChanges {
  @Input() data: any;
  @Input() resize: any;
  @Input() rateWidth:any;
  myChart: any;
  resizeId = null;
  container:HTMLElement;
  ngOnInit() {
    this.initContainer();
    this.initPie();
  }

  ngOnChanges(changes){
    if(changes.resize  && changes.resize.previousValue !== undefined){
      if(!changes.resize.currentValue){
        this.container.style.width = this.rateWidth + 'px';
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
  initContainer() {
    this.container = document.getElementById('rate');
    this.container.style.width = this.rateWidth + 'px';
    this.container.style.height = '100%';
    this.myChart = echarts.init(this.container);
  }

  /*初始化地图*/
  initPie() {
    const option = {
      color: ['#5ab1ef','#7e8dcd','#2ec7c9','#3eb839'],
      grid: {
        top: '20%',
        left: '1%',
        bottom: '3%',
        right:'3%',
        containLabel: true
      },
      series : [
        {
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          label:{formatter:"{b}：{c}"},
          data:this.data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.myChart.clear();
    this.myChart.setOption(option);
  }
  ngOnDestroy(){
    this.myChart.dispose();
    if(this.resizeId) clearTimeout(this.resizeId);
  }
}
