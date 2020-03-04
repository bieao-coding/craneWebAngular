import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Project} from "../model/project";
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ProjectManageService} from "../service/projectmanage.service";
import {PublicService} from "../../../utils/public.service";
import {ActivatedRoute,Router} from "@angular/router";
declare var BMap:any;
@Component({
  selector:'layout-projectform',
  templateUrl:'./projectform.component.html'
})
export class ProjectFormComponent implements OnInit{
  projectform: FormGroup;
  formErrors:any;
  formAuth = {save:false};//本页面的权限
  validationMessages:any;
  lockStatus = [{label:'施工中', value:0},{label:'停工', value:1},{label:'竣工', value:2}];
  workCompanies = [];
  buildCompanies = [];
  supervisionCompanies = [];
  project:Project = {};
  projectId:number|string;
  areas = [];
  showArea = false;
  showMap = false;
  constructor(private breadcrumbService: BreadcrumbService,private fb: FormBuilder,private route: ActivatedRoute,private router:Router,
              private projectService:ProjectManageService,private pu: PublicService){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '工程管理', routerLink: ['/layout/projects']},
      { label: `工程${this.route.snapshot.paramMap.has('id')? '编辑':'新增'}` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.getAuth();
    /*验证项的错误信息*/
    this.formErrors = {
      projectName:'',
      workPermit:'',
      manager:'',
      telephone:'',
      address:'',
      location:'',
      workCompanyId:'',
      buildCompanyId:'',
      supervisionCompanyId:'',
    };
    /*验证消息*/
    this.validationMessages = {
      projectName: {
        required:'请填写工程名称'
      },
      workPermit:{
        required:'请填写施工许可证'
      },
      manager:{
        required:'请填写工程负责人'
      },
      telephone:{
        required:'请填写工地电话',
        pattern:'请填写正确的电话号码'
      },
      address:{
        required:'请填写工程地址'
      },
      location:{
        required:'请填写工程坐标',
      },
      workCompanyId:{
        required:'请选择施工单位'
      },
      buildCompanyId:{
        required:'请选择建设单位'
      },
      supervisionCompanyId:{
        required:'请选择监理单位'
      }
    };
    /*注册验证*/
    this.projectform = this.fb.group({
      'projectId':new FormControl(this.project.projectId),
      'projectName': new FormControl(this.project.projectName, {
        validators:Validators.required,
        updateOn:'blur'
      }),
      'workPermit':new FormControl(this.project.workPermit,{
        validators:Validators.required,
        updateOn:'blur'
      }),
      'manager': new FormControl(this.project.manager, {
        validators:[
          Validators.required,
        ],
        updateOn:'blur'
      }),
      'telephone': new FormControl(this.project.telephone, {
        validators:[
          Validators.required,
          Validators.pattern('(^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$)|(^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$)'),
        ],
      }),
      'address': new FormControl(this.project.address, {
        validators:[
          Validators.required
        ],
        updateOn:'blur'
      }),
      'location': new FormControl(this.project.location, {
        validators:[
          Validators.required,
        ],
        updateOn:'blur'
      }),
      'workCompanyId':new FormControl(this.project.workCompanyId,{
        validators:[
          Validators.required
        ]
      }),
      'buildCompanyId':new FormControl(this.project.buildCompanyId,{
        validators:[
          Validators.required,
        ]
      }),
      'supervisionCompanyId':new FormControl(this.project.supervisionCompanyId,{
        validators:[
          Validators.required,
        ]
      }),
      'status':new FormControl(this.project.status)
    });
    /*绑定方法*/
    this.projectform.valueChanges.subscribe(data => this.pu.onValueChanges(this.projectform,this.validationMessages,this.formErrors));

    this.getList();
  }
  /*获取数据*/
  getList(){
    //单个编辑的数据
    if(this.route.snapshot.paramMap.has('id')){
      this.projectId = this.route.snapshot.paramMap.get('id');
      this.projectService.getSingleProject(1,this.projectId).subscribe((res)=>{
        if(res){
          this.workCompanies = this.pu.transDropDown(res[0].data,'workCompanyName','workCompanyId');
          this.buildCompanies = this.pu.transDropDown(res[1].data,'buildCompanyName','buildCompanyId');
          this.supervisionCompanies = this.pu.transDropDown(res[2].data,'supervisionCompanyName','supervisionCompanyId');
          this.projectform.patchValue(res[3].data);
          this.areas = res[4];
        }
      })
    }else{
      this.projectService.getSingleProject(0).subscribe((res)=>{
        if(res){
          this.workCompanies = this.pu.transDropDown(res[0].data,'workCompanyName','workCompanyId');
          this.buildCompanies = this.pu.transDropDown(res[1].data,'buildCompanyName','buildCompanyId');
          this.supervisionCompanies = this.pu.transDropDown(res[2].data,'supervisionCompanyName','supervisionCompanyId');
          this.areas = res[3];
          this.projectform.patchValue({status:0, workCompanyId:(this.workCompanies.length && this.workCompanies[0].value) || null,buildCompanyId:(this.buildCompanies.length && this.buildCompanies[0].value) || null,
            supervisionCompanyId:(this.supervisionCompanies.length && this.supervisionCompanies[0].value) || null});
        }
      })
    }
  }
  /*点击地址*/
  addressClick(ev){
    // const oEvent = ev || event;
    // oEvent.cancelBubble = true;
    // this.showMap = false;
    // this.showArea = true;
  }
  /*点击地址*/
  mapClick(ev){
    const oEvent = ev || event;
    oEvent.cancelBubble = true;
    this.showMap = true;
  }
  /*返回所选地址*/
  getAddress(address){
    this.projectform.patchValue({address:!!address ? address : this.projectform.get('address').value});
    this.showArea = false;
    if(!!address) this.formErrors.address = '';
  }
  /*返回所选坐标*/
  getMap(coordinate){
    this.projectform.patchValue({location:!!coordinate.currentCord ? coordinate.currentCord : this.projectform.get('location').value});
    if(coordinate.closed){
      this.showMap = false;
    }
    if(!!coordinate.currentCord) this.formErrors.location = '';
  }
  /*添加*/
  submit(){
    if(!this.projectform.valid) return;
    this.project = this.projectform.value;
    if(this.projectId){
      this.projectService.editProject(this.project).subscribe((rep) => {
        if(!rep.status) window.history.go(-1);
      })
    }else{
      this.projectService.addProject(this.project).subscribe((rep) => {
        if(!rep.status) window.history.go(-1);
      })
    }
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/projects/{projectId}'] ? !!item['/projects/{projectId}'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
