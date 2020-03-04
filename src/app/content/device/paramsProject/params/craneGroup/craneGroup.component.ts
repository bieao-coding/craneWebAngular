import {Component, OnInit,OnDestroy} from "@angular/core";
import {BreadcrumbService} from '../../../../../service/breadcrumb.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../../utils/public.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ParamsService} from "../../service/params.service";
import {CraneStructurePingTwo} from "../../../model/craneStructurePingTwo";
import {CenterService} from "../../service/center.service";
import {MessageService} from "../../../../../service/message.service";

@Component({
  selector: 'layout-group',
  templateUrl: './craneGroup.component.html',
})
export class CraneGroupComponent implements OnInit {
  maxHeight:number = window.innerHeight - 86 - 40 - 40;
  settingForm: FormGroup;
  formErrors: any = {};
  validationMessages: any = {};
  submitExit = false;
  /*塔机种类*/
  types = [{label:'平臂',value:0},{label:'动臂',value:1},{label:'塔头',value:2}];
  type = 0;
  //塔机结构参数限制
  craneStructurePing = new CraneStructurePingTwo();
  structureLimit = {craneNumber:{max:63,min:1},l1:{max:200,min:1},l2:{max:40,min:0},l3:{max:200,min:0},h1:{max:999,min:1},h2:{max:30,min:0},defaultAngle:{max:360,min:0}
    ,h3:{max:10,min:0},h5:{max:10,min:0},h4:{max:10,min:0},k1:{max:10,min:0},k2:{max:10,min:0},defaultRadius:{max:200,min:0},l4:{max:10,min:0}
    ,h6:{max:15,min:1}};
  //需要正整数的项
  positiveInteger = ['craneNumber'];
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService, private fb: FormBuilder, private route: Router, private router: ActivatedRoute,
              private params: ParamsService, private pu: PublicService,public center:CenterService,private message:MessageService) {
    this.breadcrumbService.setItems([
      {label: '塔群参数', routerLink: [`/layout/params`]},
      {label: '参数操作'},
    ]);
    this.center.centerEventer.subscribe((data)=>{
      this.center.currentValue = data;
    });
  }

  /*初始项*/
  ngOnInit() {
    this.surePcOrPh();
    this.setValidation(this.craneStructurePing,this.structureLimit);
    this.getList();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.isPh = true;
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*赋值验证方法*/
  setValidation(data,limit){
    const obj = {};
    let patter;
    let patterRegx;
    for(const item in data){
      this.formErrors[item] = '';
      if(this.positiveInteger.indexOf(item) !== -1){
        patter ='请输入正整数';
        patterRegx = Validators.pattern("^\\d+$");
      }else{
        patter ='请输入有效数字';
        patterRegx = Validators.pattern("^((\\d+(.\\d+)?)|0)$");
      }
      if(limit[item]){
        this.validationMessages[item] = {required: '请输入必填项',max:'不能大于 ' + limit[item].max,min:'不能小于 ' + limit[item].min,pattern:patter};
        obj[item] = new FormControl(data[item], { validators:[Validators.required,patterRegx,Validators.max(limit[item].max),Validators.min(limit[item].min)]})
      }else{
        this.validationMessages[item] = {required: '请输入必填项',pattern:patter};
        obj[item] = new FormControl(data[item], { validators:[Validators.required,patterRegx]})
      }
    }
    this.settingForm = this.fb.group(obj);
    this.settingForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.settingForm, this.validationMessages, this.formErrors));
  }
  /*获取数据*/
  getList(){
    this.settingForm.patchValue(this.center.currentValue)
  }
  /*保存临时数据*/
  saveTemporary(){
    if(!this.center.isEdit && this.center.usedNum.includes(parseInt(this.settingForm.value.craneNumber))){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'塔机编号已存在！'});
      return;
    }
    this.submitExit = true;
    if(this.center.isEdit){//编辑
      for(const item of this.center.defaultValue){
        if(item.craneNumber === this.settingForm.value.craneNumber){
          Object.assign(item,this.settingForm.value);
        }
      }
    }else{//新增
      this.center.defaultValue.push(this.settingForm.value);
    }
    window.history.go(-1);
  }
}
