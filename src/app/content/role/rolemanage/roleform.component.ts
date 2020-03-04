import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {RoleManageService} from "../service/rolemanage.service";
import {Role} from "../model/role";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'layout-roleform',
  templateUrl:'./roleform.component.html'
})
export class RoleFormComponent implements OnInit{
  roleform: FormGroup;
  formAuth = {save:false};//本页面的权限
  formErrors:any;
  validationMessages:any;
  role:Role = new Role();
  roleId:number|string;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private roleService:RoleManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '角色管理', routerLink: ['/layout/roles']},
      { label: `角色${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      roleName:''
    };
    /*验证消息*/
    this.validationMessages = {
      roleName: {
        required:'请填写角色名称'
      }
    };
    /*注册验证*/
    this.roleform = this.fb.group({
      'roleId': new FormControl(this.role.roleId),
      'roleName': new FormControl(this.role.roleName, {
        validators:Validators.required,
      }),
      'description': new FormControl(this.role.description)
    });
    /*绑定方法*/
    this.roleform.valueChanges.subscribe(data => this.pu.onValueChanges(this.roleform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.roleId = this.route.snapshot.paramMap.get('id');
      this.roleService.getEditData(this.roleId).subscribe((data) => this.roleform.patchValue(data.data));
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.roleform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.role = this.roleform.value;
    return this.roleId ? this.roleService.editRole(this.role) : this.roleService.addRole(this.role);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/users/{userId}'] ? !!item['/users/{userId}'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
