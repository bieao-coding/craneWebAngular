import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {CraneTypeService} from "../service/cranetype.service";
import {Router,ActivatedRoute} from "@angular/router";
@Component({
  selector:'layout-typelist',
  templateUrl:'./typelist.component.html'
})
export class TypeListComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  types = [];
  controlAuth = {add:false,edit:false};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  craneModelName = '';
  factoryId:number|string;
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  selectedModel = {};
  constructor(private breadcrumbService: BreadcrumbService,private route:ActivatedRoute,
              private craneService:CraneTypeService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '塔机型号', routerLink: ['/layout/craneFactories']},
      { label: '型号列表'}
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.backSelect();
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
      for(const item of this.types){
        if(item.craneModelId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedModel = item;
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
    this.factoryId = this.route.snapshot.paramMap.get('id');
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,craneModelName:this.craneModelName.trim(),craneFactoryId:this.factoryId};
    this.craneService.getFactoryTypes(params).subscribe((res)=>{
      if(res){
        this.types = res.data.list;
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
  /*添加型号*/
  addType(){
    this.router.navigate([`/layout/craneFactories/typelist/${this.factoryId}/cranetypeadd`]);
  }
  /*编辑型号*/
  edit(craneModelId){
    this.router.navigate([`/layout/craneFactories/typelist/${this.factoryId}/cranetypeedit/${craneModelId}`]);
    window.history.replaceState(null,null,`/layout/craneFactories/typelist/${this.factoryId}?index=${craneModelId}&pageNumber=${this.pageNumber}`);
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/craneFactories/{craneFactoryId}/craneModels'] ? !!item['/craneFactories/{craneFactoryId}/craneModels'].POST : false;
      const editAuth = item['/craneFactories/{craneFactoryId}/craneModels/{craneModelId}'] ? !!item['/craneFactories/{craneFactoryId}/craneModels/{craneModelId}'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth};
    }
  }
}
