import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {Company} from "../model/company";
import {CompanyManageService} from "../service/companymanage.service";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'layout-companyform',
  templateUrl:'./companyform.component.html'
})
export class CompanyFormComponent implements OnInit{
  companyform: FormGroup;
  formAuth = {save:false};//本页面的权限
  formErrors:any;
  validationMessages:any;
  company:Company = {};
  companyId:number|string;
  typeList = [{businessTypeName:'施工单位',businessTypeId:1},{businessTypeName:'建设单位',businessTypeId:2},{businessTypeName:'监理单位',businessTypeId:3}];
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private companyService:CompanyManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '单位管理', routerLink: ['/layout/companies']},
      { label: `单位${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      companyName:'',
      legalPerson:'',
      telephone:'',
      typeList:''
    };
    /*验证消息*/
    this.validationMessages = {
      companyName: {
        required:'请填写单位名称'
      },
      legalPerson: {
        required:'请填写单位法人代表'
      },
      typeList: {
        required:'请选择业务类型'
      },
      telephone: {
        required:'请填写联系电话',
        pattern:'请填写正确的联系电话'
      }
    };
    /*注册验证*/
    this.companyform = this.fb.group({
      'companyId':new FormControl(this.company.companyId),
      'companyName': new FormControl(this.company.companyName,{
        validators:Validators.required,
        updateOn:'blur'
      }),
      'typeList':new FormControl(this.company.typeList,{
        validators:Validators.required
      }),
      'legalPerson': new FormControl(this.company.legalPerson, {
        validators:Validators.required,
        updateOn:'blur'
      }),
      'telephone': new FormControl(this.company.telephone, {
        validators:[
          Validators.required,
          Validators.pattern("(^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$)|(^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$)")
        ],
      }),
      'webSite':new FormControl(this.company.webSite),
      'fax':new FormControl(this.company.fax),
    });
    /*绑定方法*/
    this.companyform.valueChanges.subscribe(data => this.pu.onValueChanges(this.companyform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.companyId = this.route.snapshot.paramMap.get('id');
      this.companyService.getSingleCompany(this.companyId).subscribe((data) => this.companyform.patchValue(data.data));
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.companyform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);;
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.company = this.companyform.value;
    return this.companyId ? this.companyService.editCompany(this.company) : this.companyService.addCompany(this.company);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      let saveAuth = item['/companies/{companyId}'] ? !!item['/companies/{companyId}'].PUT : false;
      saveAuth = this.route.snapshot.paramMap.has('id') ?  saveAuth : true;
      this.formAuth = {save:saveAuth};
    }
  }
}
