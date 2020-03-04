import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {MenuService} from "../service/menu.service";
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {Menu} from "../model/menu";

@Component({
  selector:'layout-userform',
  templateUrl:'./menu-form.component.html'
})
export class MenuFormComponent implements OnInit{
  menuForm: FormGroup;
  formAuth = {save:false};//本页面的权限
  formErrors:any;
  validationMessages:any;
  types:any[] = [{label:'父级',value:0},{label:'末级',value:1}];
  menu:Menu = {};
  userId:number|string;
  parentId:any;
  id:any;
  showRoot = false;
  validRoot = false;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private menuService:MenuService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '菜单列表', routerLink: ['/layout/menu']},
      { label: `菜单${this.route.snapshot.paramMap.has('parentId') ? '新增':'编辑'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      name:'',
      root:'',
      icon:'',
      sort:''
    };
    /*验证消息*/
    this.validationMessages = {
      name: {
        required:'请填写菜单名称',
      },
      sort: {
        required:'请填写菜单的同级排序',
        pattern:'请输入0~9之内的序号',
      },
      icon:{
        required:'请填写菜单图标'
      }
    };
    /*注册验证*/
    this.menuForm = this.fb.group({
      'id':new FormControl(this.menu.id),
      'name': new FormControl(this.menu.name, {
        validators:[
          Validators.required
        ],
        updateOn:'blur'
      }),
      'icon': new FormControl(this.menu.icon, {
        validators:[
          Validators.required
        ]
      }),
      'sort': new FormControl(this.menu.sort, {
        validators:[
          Validators.required,
          Validators.pattern("[0-9]")
        ]
      }),
      'parentId':new FormControl(this.menu.parentId),
      'type': new FormControl(this.menu.type),
      'root': new FormControl(this.menu.root)
    });
    /*绑定方法*/
    this.menuForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.menuForm,this.validationMessages,this.formErrors));

    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    if(this.route.snapshot.paramMap.has('parentId') || this.route.snapshot.paramMap.has('id')){
      if(this.route.snapshot.paramMap.has('parentId')){//新增
        this.parentId = this.route.snapshot.paramMap.get('parentId');
        this.menuForm.patchValue({parentId:this.parentId,type:0})
      }
      if(this.route.snapshot.paramMap.has('id')){//编辑
        this.id = this.route.snapshot.paramMap.get('id');
          this.menuService.getSingleMenu(this.id).subscribe((res)=>{
            if(res){
              this.menuForm.patchValue(res.data);
              this.showRoot = res.data.type;
            }
          })
      }
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.checkRoot()),
      debounceTime(100),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.menu = this.menuForm.value;
    if(this.id !== undefined){
      return this.menuService.editMenu(this.menu);
    }
    if(this.parentId !== undefined){
      return this.menuService.addMenu(this.menu);
    }
  }
  /*检查root地址*/
  checkRoot(){
    if(this.showRoot && !/\/layout\/\w+/.test(this.menuForm.value.root)){
      this.formErrors.root = '请输入/layout/开头的路由地址';
      this.validRoot = false;
    }else{
      this.formErrors.root = '';
      this.validRoot = true;
    }
    return this.validRoot;
  }
  /*类型变更*/
  changeType(e){
    this.showRoot = e.value;
    if(!this.showRoot) this.menuForm.patchValue({root:''});
    else this.menuForm.patchValue({root:'/layout/'})
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/menu/{id}'] ? !!item['/menu/{id}'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
