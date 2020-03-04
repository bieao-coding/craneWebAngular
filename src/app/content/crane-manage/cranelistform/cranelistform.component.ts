import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
import {CraneManageService} from "../service/cranemanage.service";
import {Crane} from "../model/crane";
import {Observable} from "rxjs/Observable";
import {switchMap,debounceTime,filter} from "rxjs/operators";

@Component({
  selector:'layout-cranelistform',
  templateUrl:'./cranelistform.component.html'
})
export class CraneListFormComponent implements OnInit{
  craneform: FormGroup;
  formErrors:any;
  formAuth = {save:false};//本页面的权限
  validationMessages:any;
  crane:Crane = {};
  projectId:number|string;
  craneId:number|string;
  sns = [];
  videoSns = [];
  works = [];
  models = [];
  types = [{label:'平臂',value:0},{label:'动臂',value:1},{label:'塔头',value:2}];
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private craneService:CraneManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '塔机管理' , routerLink: ['/layout/craneManager']},
      { label: `塔机${this.route.snapshot.paramMap.has('craneId')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      craneNumber:'',
      sn:'',
      videoSn:'',
      factoryId:'',
      modelId:''
    };
    /*验证消息*/
    this.validationMessages = {
      craneNumber: {
        required:'请填写塔机编号',
        pattern:'请填写TC开头的塔机编号'
      },
      sn: {
        required:'请选择设备sn'
      },
      videoSn: {
        required:'请选择视频sn'
      },
      factoryId:{
        required:'请选择生产厂商',
      },
      modelId:{
        required:'请选择塔机型号',
      }
    };
    /*注册验证*/
    this.craneform = this.fb.group({
      'craneId':new FormControl(this.crane.craneId),
      'craneNumber': new FormControl(this.crane.craneNumber,{
        validators:[
          Validators.required,
          Validators.pattern("TC\\d+")
        ]
      }),
      'sn': new FormControl(this.crane.sn),
      'videoSn':new FormControl(this.crane.videoSn),
      'factoryId':new FormControl(this.crane.factoryId,{
        validators:[
          Validators.required,
        ]
      }),
      'modelId':new FormControl(this.crane.modelId,{
        validators:[
          Validators.required,
        ]
      }),
      'typeId':new FormControl(this.crane.typeId),
      'projectId':new FormControl(this.crane.projectId)
    });
    /*绑定方法*/
    this.craneform.valueChanges.subscribe(data => this.pu.onValueChanges(this.craneform,this.validationMessages,this.formErrors));
    this.getList();
    this.addEvent();
  }
  /*获取数据*/
  getList(){
    this.projectId = this.route.snapshot.paramMap.get('id');
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('craneId')){
      this.craneId = this.route.snapshot.paramMap.get('craneId');
      this.craneService.getSingleCrane(1,this.projectId,this.craneId).subscribe((res)=>{
        if(res){
          this.works = this.pu.transDropDown(res[0].data,'craneFactoryName','craneFactoryId');
          this.sns = this.pu.transDropDown(res[1].data,'sn','sn');
          this.videoSns = this.pu.transDropDown(res[2].data,'sn','sn');
          this.craneform.patchValue(res[3].data);
          this.sns.unshift({label:'--',value:null});
          this.videoSns.unshift({label:'--',value:null});
          !!this.craneform.get('sn').value && this.sns.push({label:this.craneform.get('sn').value,value:this.craneform.get('sn').value});
          !!this.craneform.get('videoSn').value && this.videoSns.push({label:this.craneform.get('videoSn').value,value:this.craneform.get('videoSn').value});
          this.getCraneType(1,this.craneform.get('factoryId').value);
        }
      })
    }else{
      this.craneService.getSingleCrane(0,this.projectId).subscribe((res)=>{
        if(res){
          this.works = this.pu.transDropDown(res[0].data,'craneFactoryName','craneFactoryId');
          this.works.length && this.getCraneType(0,this.works[0].value);
          this.sns = this.pu.transDropDown(res[1].data,'sn','sn');
          this.sns.unshift({label:'--',value:null});
          this.videoSns = this.pu.transDropDown(res[2].data,'sn','sn');
          this.videoSns.unshift({label:'--',value:null});
          this.craneform.patchValue({factoryId:(this.works.length && this.works[0].value) || null,sn:(this.sns.length && this.sns[0].value) || null,
            videoSn:(this.videoSns.length && this.videoSns[0].value) || null,typeId:1,
            modelId:(this.models.length && this.models[0].value) || null,projectId:this.projectId});
        }
      })
    }
  }
  /*根据厂商查询塔机类型*/
  findModels(event){
    const value = event.value;
    this.getCraneType(0,value);
  }
  /*查询塔机类型*/
  getCraneType(state,value){
    this.craneService.getFactoryModels(this.projectId,value).subscribe((res)=>{
      this.models = this.pu.transDropDown(res.data,'craneModelName','craneModelId');
      if(!this.models.length) this.craneform.patchValue({modelId : null});
      else if(!state) this.craneform.patchValue({modelId : (this.models.length && this.models[0].value)});
    })
  }
  /*添加事件*/
  addEvent(){
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle,'submit').pipe(
      filter((ev)=>this.craneform.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  chooseRequest():Observable<any>{
    this.crane = this.craneform.value;
    return this.craneId ? this.craneService.editCrane(this.projectId,this.crane) : this.craneService.addCrane(this.projectId,this.crane);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      let saveAuth = item['/craneManager/{projectId}/cranes/{craneId}'] ? !!item['/craneManager/{projectId}/cranes/{craneId}'].PUT : false;
      saveAuth = this.route.snapshot.paramMap.has('id') ?  saveAuth : true;
      this.formAuth = {save:saveAuth};
    }
  }
}
