import {Component, OnInit, OnDestroy, ViewEncapsulation} from "@angular/core";
import {BreadcrumbService} from '../../../../service/breadcrumb.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../utils/public.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ParamsService} from "../service/params.service";
import {CraneStructurePing} from "../../model/craneStructurePing";
import {CraneStructureDong} from "../../model/CraneStructureDong";
import {CraneStructureHead} from "../../model/CraneStructureHead";
import {AntiStructure} from "../../model/antiStructure";
import {TorqueAndWind} from "../../model/TorqueAndWind";
import {CraneAlarmAndWarning} from "../../model/craneAlarmAndWarning";
import {DevicePassword} from "../../model/devicePassword";
import {VersionSetting} from "../../model/versionSetting";
import {AreaWarning} from "../../model/areaWarning";
import {WindSensor} from "../../model/windSensor";
import {DialogService} from "../../../../service/dialog.service";
import {BelongProject} from "../../model/belongProject";
import {MasterVersion} from "../../model/masterVersion";
import {ServiceStatus} from "../../model/serviceStatus";
import {AngularLimit} from "../../model/angularLimit";
import {WebSocketService} from "../../../../service/webSocket.service";
import {LoadingService} from "../../../../service/loading.service";
import {MessageService} from "../../../../service/message.service";
import {Subscription} from "rxjs/Subscription";
import {CenterService} from "../service/center.service";
import {CraneStructurePingTwo} from "../../model/craneStructurePingTwo";

@Component({
  selector: 'layout-setting',
  templateUrl: './params-setting.component.html',
  styleUrls:['./params-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParamsSettingComponent implements OnInit,OnDestroy {
  url = `ws://${window.location.host}/restful/v1/params`;
  maxHeight:number = window.innerHeight - 86 - 40 - 47 - 10;
  settingForm: FormGroup;
  formErrors: any = {};
  responseInfo = {state:0,time:''};
  responseMark = 'load';
  isRead = false;
  showDataSub:Subscription;
  validationMessages: any = {};
  currentOption = this.router.snapshot.queryParams.currentOption ? parseInt(this.router.snapshot.queryParams.currentOption) : 0;
  projectId:number|string;
  craneId:any;
  /*塔群参数设置(本机)*/
  craneStructure = [];
  craneStructureExtra = [];
  groupParams;
  settings = [
    {label:'塔机结构参数设置',value:0},{label:'防碰撞参数设置',value:1},{label:'力&力矩&风速参数设置',value:2},{label:'塔机限位参数',value:3},{label:'修改设备密码',value:4},{label:'传感器标定',value:5},{label:'回转角度标定',value:6}
    ,{label:'通讯协议版本设置',value:7},{label:'区域报警参数设置',value:8},{label:'风速传感器和风速采样频率设置',value:9},{label:'塔群参数设置',value:10},{label:'所属工程参数设置',value:11},{label:'维护参数设置',value:12},{label:'角度限位开关',value:13},{label:'查看主机箱版本',value:14}];//,{label:'查看屏幕版本',value:15}
  /*塔机种类*/
  types = [{label:'平臂',value:0},{label:'动臂',value:1},{label:'塔头',value:2}];
  type = 0;
  /*回转角度标定*/
  //方向
  directions = [{label:'正', value:0},{label:'反', value:1}];
  states = [{label:'开', value:0},{label:'关', value:1}];
  direction = 0;
  //区域随动
  checked:boolean = true;
  //塔机结构参数限制
  //craneStructureDong = new CraneStructureDong();
  craneStructurePing = new CraneStructurePing();
  //craneStructureHead = new CraneStructureHead();
  structureLimit = {num:{max:63,min:1},length1:{max:200,min:1},length2:{max:40,min:0},length3:{max:200,min:0},height1:{max:999,min:1},height2:{max:30,min:0},defaultAngleNum:{max:360,min:0}
  ,height3:{max:10,min:0},height5:{max:10,min:0},height4:{max:10,min:0},width1:{max:10,min:0},width2:{max:10,min:0},attachDefaultRadius:{max:200,min:0},attachLength4:{max:10,min:0}
  ,attachHeight6:{max:15,min:1}};
  //防碰撞参数限制
  antiStructure = new AntiStructure();
  antiStructureLimit = {slewWarning3:{max:180,min:0},slewWarning:{max:180,min:0},slewAlarm:{max:180,min:0},minSlewWarning:{max:180,min:0},breakSlewWarning:{max:180,min:0},breakDelay:{max:30,min:0},radiusWarning:{max:20,min:0}
    ,radiusAlarm:{max:20,min:0},minSlewSpeed:{max:5,min:0},moveAreaWarning:{max:180,min:0},slewAreaWarning:{max:180,min:0},slewAreaAlarm:{max:180,min:0},radiusAreaWarning:{max:999,min:0},radiusAreaAlarm:{max:999,min:0}};
  //力矩风速参数限制
  torqueAndWind = new TorqueAndWind();
  torqueAndWindLimit = {torquePeccancy:{max:200,min:0},torqueAlarm:{max:200,min:0},torqueWarning:{max:200,min:0},windAlarm:{max:32,min:3},windWarning:{max:32,min:0}};
  //塔机限位参数限制
  craneAlarmAndWarning = new CraneAlarmAndWarning();
  craneAlarmAndWarningLimit = {inWarning:{max:90,min:0},inAlarm:{max:90,min:0},outWarning:{max:20,min:0},outAlarm:{max:20,min:0}};
  //密码参数限制
  devicePassword = new DevicePassword();
  devicePasswordLimit = {};
  //通讯协议版本设置
  versions = [{label:'MT105A',value:0},{label:'MT105S',value:1},{label:'MT105',value:2}];
  versionSetting = new VersionSetting();
  versionSettingLimit = {sendDelayTime:{max:500,min:200},commQuality:{max:30,min:5}};
  /*区域报警参数设置*/
  areaWarning = new AreaWarning();
  areaWarningLimit = {moveAreaWarning:{max:180,min:0},slewAreaWarning:{max:180,min:0},slewAreaAlarm:{max:180,min:0},radiusAreaWarning:{max:999,min:0},radiusAreaAlarm:{max:999,min:0}};
  /*风速传感器和风速采样频率设置*/
  windSensor = new WindSensor();
  windSensorLimit = {windSensorRatio:{max:1,min:0.0001},windSamplingFre:{max:10,min:1}};
  /*所属工程参数设置*/
  belongProject = new BelongProject();
  belongProjectLimit = {};
  models = [];
  /*主机箱版本*/
  masterVersion = new MasterVersion();
  masterVersionLimit = {};
  /*屏幕版本*/
  screenVersion = new MasterVersion();
  screenVersionLimit = {};
  /*维护参数设置*/
  serviceStatus = new ServiceStatus();
  serviceStatusLimit = {};
  /*角度限位开关*/
  angularLimit = new AngularLimit();
  angularLimitTwo = {};
  //需要正整数的项
  positiveInteger = ['num','defaultAngleNum','breakDelay','windAlarm','windWarning','sysPassword','setupPassword','userPassword'];
  noValidItem = ['craneTypeNum','attachDefaultAngle','attachDefaultHeight','attachDummy3','moveAreaAlarm','antiSlewSpeed','radiusWarning3','moveWarning','moveAlarm'];
  requiredItem = ['projectName','projectAdd'];
  flowStyle = {};
  areas = [];
  showArea = false;
  settingsCmd = {0:'CraneStructureExt',1:'ExtAntiCollision',2:'CraneLimit',3:'CraneStop',4:'CranePassword',7:'ProtocolVersionAndSendDelayExt',8:'ExtAntiCollision',9:'WindSpeedExt',10:'TowerGroupExt',11:'ProjectInfo',12:'Maintenance',13:'AngleLimitSwitch',14:'SystemInfo',15:'ScreenSystemInfo'};
  constructor(private breadcrumbService: BreadcrumbService, private fb: FormBuilder, private route: Router, private router: ActivatedRoute,private load:LoadingService,private message:MessageService,
              private params: ParamsService, private pu: PublicService,private dialogService:DialogService,private socket:WebSocketService,public center:CenterService) {
    this.breadcrumbService.setItems([
      {label: '工程列表', routerLink: ['/layout/params']},
      {label: '参数设置'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    this.surePcOrPh();
    this.getList();
    this.changeOption();
    this.showData();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*获取数据*/
  getList(){
    this.projectId = this.router.snapshot.paramMap.get('id');
    this.craneId = this.router.snapshot.paramMap.get('craneId');
    this.getAddressJson();
  }
  /*获取数据暂时数据*/
  showData(){
    this.showDataSub = this.socket.socketHandler.subscribe((res)=>{
      console.log(res);
      if(!!JSON.parse(res)){
        const deviceInfo = JSON.parse(res);
        if(!!deviceInfo.data){
          if(!deviceInfo.status){
            if(!!deviceInfo.rw){
              if(deviceInfo.rw === 'R'){
                this.responseMark = 'read';
                if(deviceInfo.data.readStatus === 'Success'){
                  this.message.setMsg({severity:'success', summary:'Success Message', detail:'读取成功！'});
                  this.responseInfo = {state:1,time:deviceInfo.data.readTime};
                  this.isRead = true;
                  if(this.currentOption === 10){
                    this.center.defaultValue = this.filterCranes(deviceInfo.data.list);
                    this.craneStructureExtra = this.filterCranes(deviceInfo.data.list);
                    this.center.responseInfo = {state:1,time:deviceInfo.data.readTime};
                    this.center.responseMark = 'read';
                  }
                }else{
                  this.message.setMsg({severity:'error', summary:'Error Message', detail:'读取失败！'});
                  this.responseInfo = {state:0,time:deviceInfo.data.readTime};
                }
              }
              if(deviceInfo.rw === 'W'){
                this.responseMark = 'writer';
                if(deviceInfo.data.writeStatus === 'Success'){
                  this.message.setMsg({severity:'success', summary:'Success Message', detail:'设置成功！'});
                  this.responseInfo = {state:1,time:deviceInfo.data.writeTime};
                }else{
                  this.message.setMsg({severity:'error', summary:'Error Message', detail:'设置失败！'});
                  this.responseInfo = {state:0,time:deviceInfo.data.writeTime};
                }
              }
            }else{
              this.responseMark = 'load';
              this.isRead = false;
              //工程信息中的类型列表
              if(this.currentOption === 11){
                this.models = this.pu.transDropDown(deviceInfo.data.models,'craneModelName','craneModelId')
              }
              if(this.currentOption === 10){
                if(!!deviceInfo.data.list){
                  this.craneStructureExtra = this.filterCranes(deviceInfo.data.list);
                  this.socket.sendMessage(this.url,{cmd:'CraneStructureExt',"vo":{},craneId:this.craneId,rwStatus:'L'});
                }else{
                  this.center.selfCrane = [deviceInfo.data];
                  this.craneStructure = [deviceInfo.data];
                }
              }
            }
            if(this.currentOption !== 10){
              this.settingForm.patchValue(deviceInfo.data);
            }
          }else{
            this.message.setMsg({severity:'error', summary:'Error Message', detail:'操作失败！'});
          }
        }else if(deviceInfo.status === 8){
          this.message.setMsg({severity:'error', summary:'Error Message', detail:'设备下线！'});
        }else{
          this.message.setMsg({severity:'error', summary:'Error Message', detail:'操作失败！'});
        }
      }
    })
  }
  /*切换不同的选项加载不同的东西*/
  changeOption(){
    let data = {};
    let limit = {};
    this.responseMark = 'load';
    this.isRead = false;
    switch(this.currentOption){
      case 0:
        data = this.craneStructurePing;
        limit = this.structureLimit;
        this.setValidation(data,limit);
        break;
      case 1:
        data = this.antiStructure;
        limit = this.antiStructureLimit;
        this.setValidation(data,limit);
        break;
      case 2:
        data = this.torqueAndWind;
        limit = this.torqueAndWindLimit;
        this.setValidation(data,limit);
        break;
      case 3:
        data = this.craneAlarmAndWarning;
        limit = this.craneAlarmAndWarningLimit;
        this.setValidation(data,limit);
        break;
      case 4:
        data = this.devicePassword;
        limit = this.devicePasswordLimit;
        this.setValidation(data,limit);
        break;
      case 7:
        data = this.versionSetting;
        limit = this.versionSettingLimit;
        this.setValidation(data,limit);
        break;
      case 8:
        data = this.antiStructure;
        limit = this.antiStructureLimit;
        this.setValidation(data,limit);
        break;
      case 9:
        data = this.windSensor;
        limit = this.windSensorLimit;
        this.setValidation(data,limit);
      break;
      case 11:
        data = this.belongProject;
        limit = this.belongProjectLimit;
        this.setValidation(data,limit);
        break;
      case 12:
        data = this.serviceStatus;
        limit = this.serviceStatusLimit;
        this.setValidation(data,limit);
        break;
      case 13:
        data = this.angularLimit;
        limit = this.angularLimitTwo;
        this.setValidation(data,limit);
        break;
      case 14:
        data = this.masterVersion;
        limit = this.masterVersionLimit;
        this.setValidation(data,limit);
        break;
      case 15:
        data = this.screenVersion;
        limit = this.screenVersionLimit;
        this.setValidation(data,limit);
        break;
      default:
        break;
    }
    if(this.currentOption !== 10 || (this.currentOption === 10 && !this.center.isRead)){
      this.resetService();
      this.socket.sendMessage(this.url,{cmd:this.settingsCmd[this.currentOption],"vo":{},craneId:this.craneId,rwStatus:'L'});

    }else{
      this.isRead = true;
      this.craneStructure = this.center.selfCrane;
      this.craneStructureExtra = this.center.defaultValue;
    }
  }
  /*对本地服务进行重置*/
  resetService(){
    this.center.defaultValue = [];//草稿数组存放临时数据
    this.center.selfCrane = [];//本塔机的数据
    this.center.currentValue = {};//编辑或新增的数据
    this.center.isEdit = false;
    this.center.responseMark = '';
    this.center.responseInfo = {state:0,time:''};
    this.center.isRead = false;//读取的参数才可以编辑
    this.center.usedNum = [];//已经被使用了的塔机编号
  }
  /*赋值验证方法*/
  setValidation(data,limit){
    const obj = {};
    let patter;
    let patterRegx;
    this.formErrors = {};
    this.validationMessages = {};
    for(const item in data){
      this.formErrors[item] = '';
      if(this.positiveInteger.indexOf(item) !== -1){
        patter ='请输入正整数';
        patterRegx = Validators.pattern("^\\d+$");
      }else if (this.noValidItem.includes(item)){
        obj[item] = new FormControl(data[item]);
        continue;
      }else if(this.requiredItem.includes(item)){
        this.validationMessages[item] = {required: '请输入必填项'};
        obj[item] = new FormControl(data[item],{ validators:[Validators.required]});
        continue;
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
  /*获取选取地址所需要的json数据*/
  getAddressJson(){
    this.params.getAddress().subscribe((res)=>{
      if(res){
        this.areas = res;
      }
    })
  }
  /*读取参数*/
  getParams(){
    this.socket.sendMessage(this.url,{cmd:this.settingsCmd[this.currentOption],craneId:this.craneId,rwStatus:'R'});
  }
  /*保存设置*/
  saveSettig(){
    if(!this.currentOption){
      Object.assign(this.settingForm.value,{craneTypeNum:this.settingForm.value.craneType,attachDefaultAngle:this.settingForm.value.defaultAngleNum})
    }
    this.socket.sendMessage(this.url,{cmd:this.settingsCmd[this.currentOption],vo:this.settingForm.value,craneId:this.craneId,rwStatus:'W'});
  }
  /*过滤num为0的相关塔机*/
  filterCranes(data){
    data = data.map((value)=>{
      delete value.id;
      delete value.sn;
      return value;
    });
    return data;
  }
  /*删除*/
  delete(crane){
    const newArray = [];
    this.craneStructureExtra = this.craneStructureExtra.filter((value)=>{
      return value.craneNumber !== crane.craneNumber;
    });
    for(const item of this.center.defaultValue){
      if(item.craneNumber !== crane.craneNumber){
        newArray.push(item);
      }
    }
    this.center.defaultValue = newArray;
  }
  /*点击地址*/
  addressClick(ev){
    const oEvent = ev || event;
    oEvent.cancelBubble = true;
    this.showArea = true;
  }
  /*返回所选地址*/
  getAddress(address){
    this.settingForm.patchValue({projectAdd:!!address ? address : this.settingForm.get('projectAdd').value});
    this.showArea = false;
    if(!!address) this.formErrors.projectAdd = '';
  }
  /*塔群编辑*/
  operatorCrane(type,params){
    if(type) {
      this.groupParams = params;
      this.center.isEdit = true;
    } else {
      this.groupParams = new CraneStructurePingTwo();
      this.center.isEdit = false;
    }
    this.route.navigate([`/layout/params/setParams/craneGroup`]);
    window.history.replaceState(null,null,`/layout/params/${this.projectId}/setParams/${this.craneId}?currentOption=${this.currentOption}`)
  }
  /*本塔机编辑*/
  singleEdit(){
    this.currentOption = 0;
  }
  /*塔群设置*/
  saveTowerGroup(){
    if(!this.checkRepeat()){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'塔机编号重复！'});
      return;
    }
    this.socket.sendMessage(this.url,{cmd:this.settingsCmd[this.currentOption],vo:this.craneStructureExtra,craneId:this.craneId,rwStatus:'W'});
  }
  /*检查塔机编号重复*/
  checkRepeat() {
    const newArray = [...this.craneStructure, ...this.craneStructureExtra];
    const obj = {};
    let flag = true;
    for(const item of newArray){
      const key = parseInt(item.num || item.craneNumber);
      if(!obj[key]){
        obj[key] = item;
      }else{
        flag  = false;
      }
    }
    return flag;
  }
  /*销毁*/
  ngOnDestroy(){
    this.socket.closeSocket();
    if(this.showDataSub){
      this.showDataSub.unsubscribe();
    }
    if(!!this.groupParams) {
      this.center.usedNum = [];
      const array = [...this.craneStructure, ...this.craneStructureExtra];
      for(const item of array){
        this.center.usedNum.push(parseInt(item.craneNumber || item.num));
      }
      this.center.isRead = true;
      this.center.centerEventer.emit(this.groupParams);
    }
    if(!this.groupParams) this.center.defaultValue = [];
  }
}
