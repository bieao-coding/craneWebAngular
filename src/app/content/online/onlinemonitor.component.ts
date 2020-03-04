import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {OnlineMonitorService} from "./service/onlinemonitor.service";
import {PublicService} from "../../utils/public.service";
import {Router,ActivatedRoute} from "@angular/router";
declare var $:any;
@Component({
  selector:'layout-monitor',
  templateUrl:'./onlinemonitor.component.html'
})
export class OnlineMonitorComponent implements OnInit {
  maxHeight:number = window.innerHeight-86-40-47-46;
  projects = [];
  controlAuth = {
    spread: false,
    antiRun: false,
    side: false,
    antiWorkData: false,
    antiRunTime: false,
    videoRunTime: false,
    liveVideo: false,
    recordedVideo: false
  };//本页面的权限
  cranesList = {};
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10, 20, 30];//分页码
  searchValue = '';
  element: HTMLElement;
  index = -1;
  clickRow: any;
  isPh = false;
  flowStyle = {};
  selectedProject = {};
  constructor(private breadcrumbService: BreadcrumbService, private pu: PublicService, private router: Router, private route: ActivatedRoute,
              private online: OnlineMonitorService) {
    this.breadcrumbService.setItems([
      {label: '在线监控'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    this.backPageNum();
    this.surePcOrPh();
    this.getAuth();
    this.setIndex();
    this.getList();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.isPh = true;
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*返回页数*/
  backPageNum(){
    if (this.route.snapshot.queryParams.pageNumber) {
      this.pageNumber = parseInt(this.route.snapshot.queryParams.pageNumber);
    }
  }
  /*设置index*/
  setIndex() {
    if (this.route.snapshot.queryParams.index) {
      this.index = parseInt(this.route.snapshot.queryParams.index);
    }
  }

  /*返回选中*/
  backSelect() {
    setTimeout(() => {
      if (this.route.snapshot.queryParams.index) {
        for(const item of this.projects){
          if(item.projectId === parseInt(this.route.snapshot.queryParams.index)){
            this.selectedProject = item;
          }
        }
        if(parseInt(this.route.snapshot.queryParams.expand) && document.getElementsByClassName('click-row').length){
          this.clickRow = document.getElementsByClassName('click-row')[0];
          this.clickRow.click();
        }
      }
    }, 200);
  }

  /*获取数据*/
  getList() {
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize, search: this.searchValue.trim()};
    this.online.getList(params).subscribe((res) => {
      if (res) {
        this.projects = res.data.list;
        this.allCraneList(this.projects);
        this.total = res.data.total;
        this.backSelect();
      }
    })
  }
  /*分页事件*/
  pageChange(event) {
    this.resolveExpand();
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0)
  }
  /*翻页时处理扩展行*/
  resolveExpand(){
    const classes = $('.ui-expanded-row-content');
    if(!!classes.length) {
      for(let i = 0; i < classes.length; i++){
        $(classes[i]).prev().click();
      }
    }
  }
  /*整合塔机列表*/
  allCraneList(data) {
    for (const item of data) {
      const key = 'cranes' + item.projectId;
      this.cranesList[key] = [];
    }
  }

  /*显示塔机列表*/
  exportRow(row) {
    const key = 'cranes' + row.data.projectId;
    this.online.getCraneList(row.data.projectId).subscribe((res) => {
      if (res) {
        this.cranesList[key] = this.pu.transGroup(res['data'], ['craneId', 'craneNumber','craneType'], [['sn', 'online'], ['videoSn', 'videoOnline']]);
      }
    })
  }

  /*点击行事件*/
  rowClick(i) {
    this.index = i;
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*具体操作分配*/
  operations(name,index,params){
    if(name === 'cranespread'){
      this.router.navigate([`/layout/dataMonitoring/${index}/${name}`]);
      window.history.replaceState(null,null,`/layout/dataMonitoring?index=${index}&pageNumber=${this.pageNumber}&expand=` + 0)
    }else{
      this.router.navigate([`/layout/dataMonitoring/${index}/${name}`],{queryParams:params});
      window.history.replaceState(null,null,`/layout/dataMonitoring?index=${index}&pageNumber=${this.pageNumber}&expand=` + 1)
    }
  }
  /*获取权限*/
  getAuth() {
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if (!!auth) {
      const item = auth.auth;
      const spreadAuth = item['/dataMonitoring/{projectId}/cranesDistribution/realTime'] ? !!item['/dataMonitoring/{projectId}/cranesDistribution/realTime'].GET : false;
      const sideAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/sideRunData'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/sideRunData'].GET : false;
      const antiRunAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/runDataLogs'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/runDataLogs'].GET : false;
      const antiRunTimeAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/runTimeLogs'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/runTimeLogs'].GET : false;
      const antiWorkDataAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/workDataLogs'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/workDataLogs'].GET : false;
      const videoRunTimeAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/videoRunTimeLogs'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/videoRunTimeLogs'].GET : false;
      const liveVideoAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/videoLivePullUrl'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/videoLivePullUrl'].GET : false;
      const recordedVideoAuth = item['/dataMonitoring/{projectId}/cranes/{craneId}/VODLog'] ? !!item['/dataMonitoring/{projectId}/cranes/{craneId}/VODLog'].GET : false;
      this.controlAuth = {
        spread: spreadAuth,
        antiRunTime: antiRunTimeAuth,
        antiRun: antiRunAuth,
        side: sideAuth,
        antiWorkData: antiWorkDataAuth,
        videoRunTime: videoRunTimeAuth,
        liveVideo: liveVideoAuth,
        recordedVideo: recordedVideoAuth
      };
    }
  }
}
