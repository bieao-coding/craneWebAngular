declare var echarts:any;
export class BarOption{

  setBarOption(name:Array<any>,color0:string,color1:string,data:Array<any>,maxValue,themeState){
    return {
      grid: {
        borderWidth: 0,
        top: '20%',
        left:'10',
        right:'1%',
        bottom: '1%',
        textStyle: {
          color: "#fff"
        }
      },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     zoomLock:true,
      //     zoomOnMouseWheel:false,
      //     yAxisIndex: [0],
      //     start: 100,
      //     end: 50
      //   }
      // ],
      yAxis: {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: name,
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          name: '',
          type: 'bar',
         // animationDurationUpdate:1000,
          barCategoryGap:'15',
          barWidth:'15',
          itemStyle: {
            normal: {
              show: true,
              color:new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                "offset": 0,
                "color": color0 // 0% 处的颜色
              },{
                "offset": 0.5,
                "color": color0 // 100% 处的颜色
              }, {
                "offset": 1,
                "color": color1 // 100% 处的颜色
              }], false),
              barBorderRadius:[50,50,50,50]
            },
            emphasis: {
              shadowBlur: 15,
              shadowColor: 'rgba(105,123, 214, 0.7)'
            }
          },
          label:{
            normal: {
              show: true,
              position:'insideLeft',
              formatter: '{b}：{c}',
              color: !themeState ? '#424242' : '#fff',
              fontSize:11,
              distance:10,
            }
          },
          zlevel: 2,
          data: data,
        },
        {
          name: '',
          type: 'bar',
          //animationDurationUpdate:1000,
          itemStyle: {
            normal: {
              show: true,
              color: !themeState ? '#e6e9ea' : '#121e29',
              barBorderRadius:[50,50,50,50]
            }
          },
          label:{
            show:false
          },
          zlevel: 1,
          barWidth:'15',
          barGap: '-100%',
          barCategoryGap:'15',
          data: maxValue,
        }
      ]
    }
  }
}
