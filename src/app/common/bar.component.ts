import {Component, EventEmitter, Input, OnInit,OnChanges,OnDestroy} from '@angular/core';

declare var echarts: any;

@Component({
  selector: 'app-bar',
  template:`<div id="bar" style="width: 100%;height: 100%;"></div>`
})
export class BarComponent implements OnInit,OnChanges,OnDestroy {
  @Input() option: any;
  @Input() state:any;
  @Input() resize:any;
  @Input() barWidth:any;
  @Input() theme:any;
  myChart: any;
  timeId = null;
  resizeId = null;
  container:HTMLElement;
  ngOnInit() {
    this.timeId = setTimeout(()=>{
      this.initContainer();
      this.setOptionBar();
    },0);
  }
  ngOnChanges(changes){
   if(changes.state && changes.state.previousValue !== undefined && changes.state.currentValue !== changes.state.previousValue){
      this.setOptionBar();
   }
    if(changes.resize && changes.resize.previousValue !== undefined){
      if(!changes.resize.currentValue){
        this.container.style.width = this.barWidth + 'px';
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
        this.option.series[1].itemStyle.normal.color = '#121e29';
        this.option.series[0].label.normal.color = '#fff';
      }else{
        this.option.series[1].itemStyle.normal.color = '#e6e9ea';
        this.option.series[0].label.normal.color = '#424242';
      }
      this.setOptionBar();
    }
  }
  /*初始容器*/
  initContainer() {
    this.container = document.getElementById('bar');
    this.container.style.width = this.barWidth + 'px';
    this.container.style.height = '100%';
    this.myChart = echarts.init(this.container);
  }
  /*初始化地图*/
  setOptionBar() {
    //this.myChart.clear();
    this.myChart.setOption(this.option);
  }
  ngOnDestroy() {
    if (this.timeId) clearTimeout(this.timeId);
    if (this.resizeId) clearTimeout(this.resizeId);
  }
}
