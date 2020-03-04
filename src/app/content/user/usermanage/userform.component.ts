import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {User} from "../model/user";
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {UserManageService} from "../service/usermanage.service";
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'layout-userform',
  templateUrl:'./userform.component.html'
})
export class UserformComponent implements OnInit{
  userform: FormGroup;
  formAuth = {save:false};//本页面的权限
  formErrors:any;
  validationMessages:any;
  roles: any[] = [];
  userSex = [{label:'男', value:0},{label:'女', value:1}];
  lockStatus = [{label:'启用', value:0},{label:'禁用', value:1}];
  companies:any[] = [];
  user:User = {};
  userId:number|string;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private userManageService:UserManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '用户管理', routerLink: ['/layout/users']},
      { label: `用户${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      username:'',
      realName:'',
      idCard:'',
      email:'',
      telephone:'',
      companyId:''
    };
    /*验证消息*/
    this.validationMessages = {
      username: {
        required:'请填写登录名',
        //pattern:'请输入2~4个汉字'
      },
      realName:{
        required:'请填写用户姓名'
      },
      companyId:{
        required:'请选择所属单位'
      },
      idCard:{
        required:'请填写身份证号',
        pattern:'请输入正确的身份证号'
      },
      email:{
        required:'请填写邮箱地址',
        pattern:'请输入正确的邮箱地址'
      },
      telephone:{
        required:'请填写联系电话',
        pattern:'请输入正确的联系电话',
      }
    };
    /*注册验证*/
    this.userform = this.fb.group({
      'userId':new FormControl(this.user.userId),
      'username': new FormControl(this.user.username, {
        validators:[
          Validators.required,
          //Validators.pattern("^[\u4e00-\u9fa5]{2,4}$")
        ],
        updateOn:'blur'
      }),
      'companyId':new FormControl(this.user.companyId, {
        validators:[
          Validators.required
        ]
      }),
      'realName': new FormControl(this.user.realName, {
        validators:[
          Validators.required
        ],
        updateOn:'blur'
      }),
      'idCard': new FormControl(this.user.idCard, {
        validators:[
          Validators.required,
          Validators.pattern("^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$")
        ],
        updateOn:'blur'
      }),
      'email': new FormControl(this.user.email, {
        validators:[
          Validators.required,
          Validators.pattern("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$")
        ],
        updateOn:'blur'
      }),
      'telephone': new FormControl(this.user.telephone, {
        validators:[
          Validators.required,
          Validators.pattern("(^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$)|(^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$)")
     ],
      }),
      'roleId':new FormControl(this.user.roleId),
      'sex':new FormControl(this.user.sex),
      'status':new FormControl(this.user.status),
      'projectList':new FormControl(this.user.projectList),
    });
    /*绑定方法*/
    this.userform.valueChanges.subscribe(data => this.pu.onValueChanges(this.userform,this.validationMessages,this.formErrors));

    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.userId = this.route.snapshot.paramMap.get('id');
      this.userManageService.getSingleUser(1,this.userId).subscribe((res)=>{
        if(res){
          this.roles = this.pu.transDropDown(res[0].data,'roleName','roleId');
          this.companies = this.pu.transDropDown(res[1].data,'companyName','companyId');
          this.userform.patchValue(res[2].data);
        }
      })
    }else{
      this.userManageService.getSingleUser(0).subscribe((res)=>{
        if(res){
          this.roles = this.pu.transDropDown(res[0].data,'roleName','roleId');
          this.companies = this.pu.transDropDown(res[1].data,'companyName','companyId');
          this.userform.patchValue({sex:0,status:0, roleId:(this.roles.length && this.roles[0].value) || null,companyId:(this.companies.length && this.companies[0].value) || null});
        }
      })
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.userform.valid),
      debounceTime(100),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.user = this.userform.value;
    return this.userId ? this.userManageService.editUser(this.user) : this.userManageService.addUser(this.user);
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
