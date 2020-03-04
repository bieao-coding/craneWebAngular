import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Router,ActivatedRoute} from "@angular/router";
import {PublicService} from "../../../utils/public.service";
import {ParamsService} from "./service/params.service";
import {CenterService} from "./service/center.service";

declare var $:any;
@Component({
  selector:'layout-paramsList',
  templateUrl:'./paramsProjectList.component.html',
})
export class ParamsProjectListComponent implements OnInit {
  maxHeight:number = window.innerHeight-86-40-47-47;
  projects = [];
  cranesList = {};
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10, 20, 30];//分页码
  searchValue = '';
  searchEvent: HTMLElement;
  index = -1;
  clickRow: any;
  isPh = false;
  flowStyle = {};
  selectedProject = {};
  constructor(private breadcrumbService: BreadcrumbService, private pu: PublicService, private router: Router, private route: ActivatedRoute,
              private params: ParamsService,private center:CenterService) {
    this.breadcrumbService.setItems([
      {label: '防撞管理'},
      {label: '参数设置'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    this.backPageNum();
    this.surePcOrPh();
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
      this.index = this.route.snapshot.queryParams.index;
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
        this.clickRow = document.getElementsByClassName('click-row')[0];
        this.clickRow.click();
      }
    }, 500)

  }

  /*获取数据*/
  getList() {
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize, search: this.searchValue.trim()};
    this.params.getProjectList(params).subscribe((res) => {
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
    },0);
  }

  /*翻页时处理扩展行*/
  resolveExpand(){
    const classes = $('.expand-tr');
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
    this.params.getCraneList(row.data.projectId).subscribe((res) => {
      if (res) {
        this.cranesList[key] = res['data'];
        for (const item of this.cranesList[key]) {
          item.index = this.index;
          item.pageNumber = this.pageNumber;
        }
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
  operations(index,craneId){
    this.router.navigate([`/layout/params/${index}/setParams/${craneId}`]);
    window.history.replaceState(null,null,`/layout/params?index=${index}&pageNumber=${this.pageNumber}`)
  }
}
