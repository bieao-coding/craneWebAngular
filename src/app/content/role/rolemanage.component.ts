import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "../../service/dialog.service";
import {RoleManageService} from "./service/rolemanage.service";
import {PublicService} from "../../utils/public.service";
import {Role} from "./model/role";

@Component({
  selector:'layout-rolemanage',
  templateUrl:'./rolemanage.component.html'
})
export class RoleManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  controlAuth = {add:false,edit:false,role:false,delete:false,number:60};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 10;//总数
  options = [10,20,30];//分页码
  roleName = '';
  roles:Role[];
  selectRow:any;
  selectedRole = {};
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
              private roleService:RoleManageService,private router:Router,private dialogService:DialogService){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '角色管理'}
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
      for(const item of this.roles){
        if(item.roleId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedRole = item;
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
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,roleName:this.roleName.trim()};
    this.roleService.getRoleList(params).subscribe((res)=>{
      if(res){
        this.roles = res.data.list;
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
  /*添加角色*/
  addRole(){
    this.router.navigate(['/layout/roles/roleadd'])
  }

  /*删除*/
  delete(row){
    this.selectRow = row;
    this.dialogService.setDialog({message:'确认删除这条信息吗？',showDialog:true,doSoming:this.doSoming()})
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/roles/${name}/${index}`]);
    window.history.replaceState(null,null,`/layout/roles?index=${index}&pageNumber=${this.pageNumber}`)
  }
  doSoming(){
    return ($event)=>{
      this.dialogService.setDialog({showDialog:false});
      if($event === true) this.roleService.delete(this.selectRow.roleId).subscribe((rep)=>{
        if(!rep.status) this.getList();
      });
    }
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/roles'] ? !!item['/roles'].POST : false;
      const editAuth = item['/roles/{roleId}'] ? !!item['/roles/{roleId}'].GET : false;
      const deleteAuth = item['/roles/{roleId}'] ? !!item['/roles/{roleId}'].DELETE : false;
      const roleAuth = item['/roles/{roleId}/authorities'] ? !!item['/roles/{roleId}/authorities'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth,role:roleAuth,delete:deleteAuth,number:60};
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
