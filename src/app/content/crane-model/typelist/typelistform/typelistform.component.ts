import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {CraneTypeService} from "../../service/cranetype.service";
import {Type} from "../../model/type";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'layout-typelistform',
  templateUrl:'./typelistform.component.html'
})
export class TypeListFormComponent implements OnInit{
  typeform: FormGroup;
  formErrors:any;
  formAuth = {save:false};//本页面的权限
  validationMessages:any;
  type:Type = new Type();
  factoryId:number|string;
  modelId:number|string;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private craneService:CraneTypeService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '塔机型号', routerLink: ['/layout/craneFactories'] },
      { label: '型号列表', routerLink: [`/layout/craneFactories/typelist/${this.route.snapshot.paramMap.get('id')}`]},
      { label: `型号${this.route.snapshot.paramMap.has('moid')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      craneModelName:'',
    };
    /*验证消息*/
    this.validationMessages = {
      craneModelName: {
        required:'请填写型号名称'
      },
    };
    /*注册验证*/
    this.typeform = this.fb.group({
      'craneModelId':new FormControl(this.type.craneModelId),
      'craneModelName': new FormControl(this.type.craneModelName,{
        validators:Validators.required
      }),
      'description':new FormControl(this.type.description),
      'craneFactoryId':new FormControl(this.type.craneFactoryId)
    });
    /*绑定方法*/
    this.typeform.valueChanges.subscribe(data => this.pu.onValueChanges(this.typeform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    this.factoryId = this.route.snapshot.paramMap.get('id');
    if(!this.factoryId) return;
    this.typeform.patchValue({craneFactoryId:this.factoryId});
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('moid')){
      this.modelId = this.route.snapshot.paramMap.get('moid');
      this.craneService.getSingleType(this.factoryId,this.modelId).subscribe((data) => this.typeform.patchValue(data.data));
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.typeform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.type = this.typeform.value;
    return this.modelId ? this.craneService.editFactoryType(this.factoryId,this.type) : this.craneService.addFactoryType(this.factoryId,this.type);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      let saveAuth = item['/craneFactories/{craneFactoryId}/craneModels/{craneModelId}'] ? !!item['/craneFactories/{craneFactoryId}/craneModels/{craneModelId}'].PUT : false;
      saveAuth = this.route.snapshot.paramMap.has('moid') ?  saveAuth : true;
      this.formAuth = {save:saveAuth};
    }
  }
}
