import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ActivatedRoute,Router} from "@angular/router";
import {Operator} from "../model/operator";
import {OperatorManageService} from "../service/operatormanage.service";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {PublicService} from "../../../utils/public.service";

@Component({
  selector:'layout-companyform',
  templateUrl:'./operatorform.component.html'
})
export class OperatorFormComponent implements OnInit{
  operatorform: FormGroup;
  formAuth = {save:false};//本页面的权限
  formErrors:any;
  validationMessages:any;
  operator:Operator = {};
  operatorId:number|string;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private operatorService:OperatorManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '人员列表', routerLink: ['/layout/personals']},
      { label: `人员${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      personalName:'',
      identityCard:''
    };
    /*验证消息*/
    this.validationMessages = {
      personalName: {
        required:'请填写人员姓名'
      },
      identityCard: {
        required:'请填写身份证号',
        pattern:'请输入正确的身份证号'
      },
    };
    /*注册验证*/
    this.operatorform = this.fb.group({
      'personalId':new FormControl(this.operator.personalId),
      'personalName': new FormControl(this.operator.personalName,{
        validators:Validators.required,
        updateOn:'blur'
      }),
      'identityCard':new FormControl(this.operator.identityCard,{
        validators:[
          Validators.required,
          Validators.pattern("^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$")
        ],
      })
    });
    /*绑定方法*/
    this.operatorform.valueChanges.subscribe(data => this.pu.onValueChanges(this.operatorform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }

  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.operatorId = this.route.snapshot.paramMap.get('id');
      this.operatorService.getSingleOperator(this.operatorId).subscribe((data) => this.operatorform.patchValue(data.data));
    }
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.operatorform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.operator = this.operatorform.value;
    return this.operatorId ? this.operatorService.editOperator(this.operator) : this.operatorService.addOperator(this.operator);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/personals/{personalId}'] ? !!item['/personals/{personalId}'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
