import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {CraneTypeService} from "../service/cranetype.service";
import {Factory} from "../model/factory";
import {Observable} from "rxjs/Observable";
import {switchMap,debounceTime,filter} from "rxjs/operators";

@Component({
  selector:'layout-craneform',
  templateUrl:'./craneform.component.html'
})
export class CraneFormComponent implements OnInit{
  factoryform: FormGroup;
  formErrors:any;
  formAuth = {save:false};//本页面的权限
  validationMessages:any;
  factory:Factory = {};
  craneFactoryId:number|string;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private craneService:CraneTypeService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '塔机型号', routerLink: ['/layout/craneFactories']},
      { label: `厂商${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      craneFactoryName:'',
      nation:''
    };
    /*验证消息*/
    this.validationMessages = {
      craneFactoryName: {
        required:'请填写厂商名称'
      },
      nation: {
        required:'请填写地区名称'
      }

    };
    /*注册验证*/
    this.factoryform = this.fb.group({
      'craneFactoryId':new FormControl(this.factory.craneFactoryId),
      'craneFactoryName': new FormControl(this.factory.craneFactoryName,{
        validators:Validators.required,
        updateOn:'blur'
      }),
      'nation': new FormControl(this.factory.nation, {
        validators:Validators.required
      }),
      'description':new FormControl(this.factory.description)
    });
    /*绑定方法*/
    this.factoryform.valueChanges.subscribe(data => this.pu.onValueChanges(this.factoryform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }
  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.craneFactoryId = this.route.snapshot.paramMap.get('id');
      this.craneService.getSingleFactory(this.craneFactoryId).subscribe((data) => this.factoryform.patchValue(data.data));
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.factoryform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.factory = this.factoryform.value;
    return this.craneFactoryId ? this.craneService.editFactory(this.factory) : this.craneService.addFactory(this.factory);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      let saveAuth = item['/craneFactories/{craneFactoryId}'] ? !!item['/craneFactories/{craneFactoryId}'].PUT : false;
      saveAuth = this.route.snapshot.paramMap.has('id') ?  saveAuth : true;
      this.formAuth = {save:saveAuth};
    }
  }
}
