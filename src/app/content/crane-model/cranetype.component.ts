import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {CraneTypeService} from "./service/cranetype.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicService} from "../../utils/public.service";

@Component({
  selector:'layout-cranetype',
  templateUrl:'./cranetype.component.html'
})
export class CraneTypeComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  factories = [];
  pageNumber = 0;//页码
  controlAuth = {add:false,edit:false,list:false,number:60};//本页面的权限
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  craneFactoryName = '';
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  selectedCrane = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
              private craneService:CraneTypeService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '塔机型号'}
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
      for(const item of this.factories){
        if(item.craneFactoryId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedCrane = item;
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
  getList(){
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,craneFactoryName:this.craneFactoryName.trim()};
    this.craneService.getFactoryList(params).subscribe((res)=>{
      if(res){
        this.factories = res.data.list;
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
  /*添加厂商*/
  addFactory(){
    this.router.navigate(['/layout/craneFactories/cranefactoryadd'])
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/craneFactories/${name}/${index}`]);
    window.history.replaceState(null,null,`/layout/craneFactories?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/craneFactories'] ? !!item['/craneFactories'].POST : false;
      const editAuth = item['/craneFactories/{craneFactoryId}'] ? !!item['/craneFactories/{craneFactoryId}'].GET : false;
      const listAuth = item['/craneFactories/{craneFactoryId}/craneModels'] ? !!item['/craneFactories/{craneFactoryId}/craneModels'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth,list:listAuth,number:60};
      let i = 0;
      for(const value in this.controlAuth){
        if(value !== 'add' && value !== 'number' && this.controlAuth[value]){
          i++;
        }
      }
      if(!!i) this.controlAuth.number = i * 60 + 10;

    }
  }
}
