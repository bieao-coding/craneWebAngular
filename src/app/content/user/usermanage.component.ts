import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {UserManageService} from "./service/usermanage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "../../service/dialog.service";
import {PublicService} from "../../utils/public.service";

@Component({
  selector:'layout-usermanage',
  templateUrl:'./usermanage.component.html'
})
export class UserManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  users = [];
  controlAuth = {add:false,edit:false,resetPassword:false,modifyPassword:false,delete:false,projects:false,number:60};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  username = '';//登录名
  realName = '';//用户名
  roleId = 0;
  selectRow:any;
  message = '';
  roles = [];
  state:number = 1;
  firstTime:boolean = true;
  selectedUser = {};
  searchEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
  private userManageService:UserManageService,private router:Router,private dialogService:DialogService){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '用户管理'}
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
      for(const item of this.users){
        if(item.userId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedUser = item;
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
    if(this.firstTime) this.state = 1;
    else this.state = 0;
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,username:this.username.trim(),realName:this.realName.trim(),roleId:this.roleId};
    this.firstTime = false;
    return this.userManageService.getList(this.state,params).subscribe((res)=>{
      if(res){
        this.users = res[0].data.list;
        this.total = res[0].data.total;
        if(!!this.state){
          this.roles.push({roleId:0,roleName:'所有角色'});
          this.roles = this.pu.transDropDown([...this.roles,...res[1].data],'roleName','roleId');
        }
        this.backSelect();
      }
    })
  }
  /*查询*/
  search(){
    this.getList();
  }
  /*分页事件*/
  pageChange(event){
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0)
  }
  /*添加用户*/
  addUser(){
    this.router.navigate(['/layout/users/useradd'])
  }
  /*密码重置*/
  resetPassword(row){
    if(!row) return;
    this.userManageService.resetPassword(row.userId).subscribe((rep)=>{});
  }
  doSoming(){
    return ($event)=>{
      this.dialogService.setDialog({showDialog:false});
      if($event === true) this.userManageService.delete(this.selectRow.userId).subscribe((rep)=>{
        if(!rep.status) this.getList();
      });
    }
  }

  /*删除*/
  delete(row){
    if(!row) return;
    this.selectRow = row;
    this.dialogService.setDialog({message:'确认删除这条信息吗？',showDialog:true,doSoming:this.doSoming()})
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/users/${name}/${index}`]);
    window.history.replaceState(null,null,`/layout/users?index=${index}&pageNumber=${this.pageNumber}`)
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/users'] ? !!item['/users'].POST : false;
      const editAuth = item['/users/{userId}'] ? !!item['/users/{userId}'].GET : false;
      const resetPasswordAuth = item['/users/{userId}/resetPassword'] ? !!item['/users/{userId}/resetPassword'].PUT : false;
      const passwordAuth = item['/users/{userId}/password'] ? !!item['/users/{userId}/password'].GET : false;
      const deleteAuth = item['/users/{userId}'] ? !!item['/users/{userId}'].DELETE : false;
      const projectsAuth = item['/users/projects'] ? !!item['/users/projects'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth,resetPassword:resetPasswordAuth,modifyPassword:passwordAuth,delete:deleteAuth,projects:projectsAuth,number:60};
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
