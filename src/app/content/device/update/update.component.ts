import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Router,ActivatedRoute} from "@angular/router";
import {PublicService} from "../../../utils/public.service";
import {UpdateService} from "./service/update.service";

declare var $:any;
@Component({
  selector:'layout-update',
  templateUrl:'./update.component.html',
})
export class UpdateComponent implements OnInit {
  maxHeight:number = window.innerHeight-86-40-47-47;
  projects = [];
  controlAuth = {list:false};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10, 20, 30];//分页码
  searchValue = '';
  searchEvent: HTMLElement;
  index = -1;
  isPh = false;
  flowStyle = {};
  selectedProject = {};
  constructor(private breadcrumbService: BreadcrumbService, private pu: PublicService, private router: Router, private route: ActivatedRoute,
              private update: UpdateService) {
    this.breadcrumbService.setItems([
      {label: '批量更新'},
      {label: '工程列表'}
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
      }
    }, 500)

  }

  /*获取数据*/
  getList() {
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize, search: this.searchValue.trim()};
    this.update.getProjectList(params).subscribe((res) => {
      if (res) {
        this.projects = res.data.list;
        this.total = res.data.total;
        this.backSelect();
      }
    })
  }

  /*分页事件*/
  pageChange(event) {
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0);
  }

  /*查询事件*/
  search(){
    this.getList();
  }

  /*具体操作分配*/
  operations(index){
    this.router.navigate([`/layout/antiUpgrade/craneList/${index}`]);
    window.history.replaceState(null,null,`/layout/antiUpgrade?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const listAuth = item['/antiUpgrade/projects/{projectId}/upgradeSoftwareInfo'] ? !!item['/antiUpgrade/projects/{projectId}/upgradeSoftwareInfo'].GET : false;
      this.controlAuth = {list:listAuth};
    }
  }
}
