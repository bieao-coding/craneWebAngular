import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {CraneManageService} from "./service/cranemanage.service";
import {PublicService} from "../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
declare var $:any;
@Component({
  selector:'layout-cranemanage',
  templateUrl:'./cranemanage.component.html'
})
export class CraneManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-47-46;
  projects = [];
  controlAuth = {add:false,edit:false,operator:false};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  searchValue = '';
  searchEvent:HTMLElement;
  cranesList = {};
  isPh = false;
  clickRow: any;
  index = -1;
  flowStyle = {};
  selectedProject = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,private router:Router,
              private craneService:CraneManageService){
    this.breadcrumbService.setItems([
      { label: '塔机管理' }
    ]);
  }
  /*初始项*/
  ngOnInit(){
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
  /*返回选中*/
  backSelect() {
    setTimeout(() => {
      if (this.route.snapshot.queryParams.index) {
        for(const item of this.projects){
          if(item.projectId === parseInt(this.route.snapshot.queryParams.index)){
            this.selectedProject = item;
          }
        }
        if(document.getElementsByClassName('click-row').length){
          this.clickRow = document.getElementsByClassName('click-row')[0];
          this.clickRow.click();
        }
      }
    }, 200);
  }

  /*设置index*/
  setIndex() {
    if (this.route.snapshot.queryParams.index) {
      this.index = parseInt(this.route.snapshot.queryParams.index);
    }
  }

  /*返回页数*/
  backPageNum(){
    if (this.route.snapshot.queryParams.pageNumber) {
      this.pageNumber = parseInt(this.route.snapshot.queryParams.pageNumber);
    }
  }
  /*获取数据*/
  getList(){
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,search:this.searchValue.trim()};
    this.craneService.getProjectList(params).subscribe((res)=>{
      if(res){
        this.projects = res.data.list;
        this.allCraneList(this.projects);
        this.total = res.data.total;
        this.backSelect();
      }
    })
  }
  /*分页事件*/
  pageChange(event){
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
    this.craneService.getCraneList(row.data.projectId).subscribe((res) => {
      if (res) {
        this.cranesList[key] = this.pu.transGroup(res['data'], ['craneId', 'craneNumber','craneType','personalCount'], [['sn', 'online'], ['videoSn', 'videoOnline']]);
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
  operations(name,index,craneId){
    if(name === 'cranelistadd'){
      this.router.navigate([`/layout/craneManager/cranelist/${index}/${name}`]);
    }else{
      this.router.navigate([`/layout/craneManager/cranelist/${index}/${name}/${craneId}`]);
    }
    window.history.replaceState(null,null,`/layout/craneManager?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/craneManager/{projectId}/cranes'] ? !!item['/craneManager/{projectId}/cranes'].POST : false;
      const editAuth = item['/craneManager/{projectId}/cranes/{craneId}'] ? !!item['/craneManager/{projectId}/cranes/{craneId}'].GET : false;
      const operatorAuth = item['/craneManager/{projectId}/cranes/{craneId}/personals'] ? !!item['/craneManager/{projectId}/cranes/{craneId}/personals'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth,operator:operatorAuth};
    }
  }
}
