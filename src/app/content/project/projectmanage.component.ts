import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {ProjectManageService} from "./service/projectmanage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicService} from "../../utils/public.service";

@Component({
  selector:'layout-projectmanage',
  templateUrl:'./projectmanage.component.html'
})
export class ProjectManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  projects = [];
  controlAuth = {add:false,edit:false};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  searchValue = '';
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  selectedProject = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
              private projectService:ProjectManageService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '工程管理'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.backPageNum();
    this.surePcOrPh();
    this.getAuth();
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
  /*返回选中*/
  backSelect() {
    if (this.route.snapshot.queryParams.index) {
      for(const item of this.projects){
        if(item.projectId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedProject = item;
        }
      }
    }
  }
  /*返回页数*/
  backPageNum(){
    if (this.route.snapshot.queryParams.pageNumber) {
      this.pageNumber = parseInt(this.route.snapshot.queryParams.pageNumber);
    }
  }

  /*获取数据*/
  getList() {
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,search:this.searchValue.trim()};
    this.projectService.getProjectList(params).subscribe((res)=>{
      if(res){
        this.projects = res.data.list;
        this.total = res.data.total;
        this.backSelect();
      }
    })
  }
  /*分页事件*/
  pageChange(event){
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0)
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*添加工程*/
  addProject(){
    this.router.navigate(['/layout/projects/projectadd'])
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/projects/${name}/${index}`]);
    window.history.replaceState(null,null,`/layout/projects?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/projects'] ? !!item['/projects'].POST : false;
      const editAuth = item['/projects/{projectId}'] ? !!item['/projects/{projectId}'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth};
    }
  }

}
