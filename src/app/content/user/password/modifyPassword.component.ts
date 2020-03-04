import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Password} from "../model/password";
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {UserManageService} from "../service/usermanage.service";
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";

@Component({
  selector:'layout-modifyPassword',
  templateUrl:'./modifyPassword.component.html'
})
export class ModifyPasswordComponent implements OnInit{
  passwordForm: FormGroup;
  formAuth = {save:false};//本页面的权限
  password:Password = new Password();
  formErrors:any;
  validationMessages:any;
  userId = null;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private userManageService:UserManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '用户管理', routerLink: ['/layout/users']},
      { label: `密码修改` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    this.buildForm();
    this.getUserId();
  }
  buildForm(){
    this.formErrors =  {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    };
    this.validationMessages = {
      oldPassword: {
        required: '原密码必须输入',
      },
      newPassword: {
        required: '新密码必须输入',
        pattern:'密码至少6位'
      },
      repeatPassword: {
        required: '确认密码必须输入',
        validateEqual: "两次输入的密码不一致"
      }
    };
    /*注册验证*/
    this.passwordForm = this.fb.group({
      'oldPassword':new FormControl(this.password.oldPassword, {
        validators:[
          Validators.required
        ],
        updateOn:'blur'
      }),
      'newPassword':new FormControl(this.password.newPassword, {
        validators:[
          Validators.required,
          Validators.pattern("\\w{6,}")
        ],
        updateOn:'blur'
      }),
      'repeatPassword':new FormControl(this.password.repeatPassword, {
        validators:[
          Validators.required
        ],
      })
    });
    this.passwordForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.passwordForm,this.validationMessages,this.formErrors));
  }
  /*获取userid*/
  getUserId(){
    if(this.route.snapshot.paramMap.has('id')){
      this.userId = this.route.snapshot.paramMap.get('id');
    }
  }
  /*校验原密码*/
  modify(){
    if(this.userId){
      this.password = this.passwordForm.value;
      this.userManageService.checkOldPassword({userId:this.userId,password:this.password.oldPassword}).subscribe((res)=>{
        if(res){
          if(!res['status']){
            this.modifyPassword();
          }
        }
      })
    }
  }

  /*修改密码*/
  modifyPassword(){
    this.userManageService.modifyPassword({userId:this.userId,password:this.password.newPassword}).subscribe((rep)=>{
      if(!rep['status']) window.history.go(-1);
    })
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/users/{userId}/password'] ? !!item['/users/{userId}/password'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
