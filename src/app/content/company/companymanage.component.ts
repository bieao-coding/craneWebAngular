import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {CompanyManageService} from "./service/companymanage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicService} from "../../utils/public.service";

@Component({
  selector:'layout-companymanage',
  templateUrl:'./companymanage.component.html'
})
export class CompanyManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  companies = [];
  pageNumber = 0;//页码
  controlAuth = {add:false,edit:false};//本页面的权限
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  companyName = '';
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  selectedCompany = {};
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
              private companyService:CompanyManageService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '单位管理'}
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
      for(const item of this.companies){
        if(item.companyId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedCompany = item;
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
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,companyName:this.companyName.trim()};
    this.companyService.getCompanyList(params).subscribe((res)=>{
      if(res){
        this.companies = res.data.list;
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
  /*添加单位*/
  addCompany(){
    this.router.navigate(['/layout/companies/companyadd'])
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/companies/${name}/${index}`]);
    window.history.replaceState(null,null,`/layout/companies?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/companies'] ? !!item['/companies'].POST : false;
      const editAuth = item['/companies/{companyId}'] ? !!item['/companies/{companyId}'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth};
    }
  }
}
