import {Component,OnInit,OnDestroy} from "@angular/core";
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import {Router,ActivatedRoute} from "@angular/router";
import {PublicService} from "../../../../utils/public.service";
import {UpdateService} from "../service/update.service";
import {VersionCenterService} from "../service/version-center.service";
import {Subscription} from "rxjs/Subscription";
import {MessageService} from "../../../../service/message.service";
import {Subject} from "rxjs/Subject";

declare var $:any;
@Component({
  selector:'layout-craneList',
  templateUrl:'./craneList.component.html',
})
export class CraneListComponent implements OnInit,OnDestroy {
  url = `ws://${window.location.host}/restful/v1/params`;
  maxHeight:number = window.innerHeight-86-40-47-47;
  cranes = [];
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10, 20, 30];//分页码
  searchValue = '';
  searchEvent: HTMLElement;
  isPh = false;
  flowStyle = {};
  projectId;
  selectedProject = {};
  showDataSub:Subscription;
  selectedOperators = [];
  ws:WebSocket;
  socketSource = new Subject<any>();
  socketHandler = this.socketSource.asObservable();
  index = 0;
  refreshMark;
  isSingle = false;
  clickVersionButton = false;
  constructor(private breadcrumbService: BreadcrumbService, private pu: PublicService, private router: Router, private route: ActivatedRoute,
              private update: UpdateService,private center:VersionCenterService,private message:MessageService) {
    this.breadcrumbService.setItems([
      {label: '工程列表', routerLink: ['/layout/antiUpgrade']},
      {label: '更新列表'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    this.surePcOrPh();
    this.getList();
    this.showData();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.isPh = true;
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*链接websocket*/
  linkWebSocket(params){
    this.ws = new WebSocket(`ws://${window.location.host}/restful/v1/params`);
    this.ws.onopen = ()=>{
      this.sendCmd(params);
      console.log('链接成功');
    };
    this.ws.onmessage = (res)=> {
      this.socketSource.next(res.data);
    };
    this.ws.onerror = ()=>{
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'操作失败！'});
      console.log('链接失败');
    };
    this.ws.onclose = (e)=>{
      console.log('链接关闭');
    };
  }
  /*发送命令*/
  sendCmd(message){
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }else{
      this.linkWebSocket(message);
    }
  }
  /*获取暂时数据*/
  showData(){
    this.showDataSub = this.socketHandler.subscribe((res)=>{
      console.log(res);
      if(!!JSON.parse(res)){
        const deviceInfo = JSON.parse(res);
        if(!!deviceInfo.data){
          if(!deviceInfo.status){
            if(!!deviceInfo.rw){
              if(deviceInfo.rw === 'R'){
                if(deviceInfo.cmd === 'SystemInfo'){
                  this.updateVersion(deviceInfo.data);
                  this.index++;
                  this.switchCmd(deviceInfo.cmd, 'R', this.index);
                }
              }
              if(deviceInfo.rw === 'W'){
                if(!this.isSingle){
                  if(this.index === this.selectedOperators.length - 1){
                    this.afterCmdDo(deviceInfo);
                  }else {
                    this.index++;
                    this.switchCmd(deviceInfo.cmd, 'W', this.index);
                  }
                }else{
                  this.afterCmdDo(deviceInfo);
                }
              }
            }
          }else{
            if(deviceInfo.rw === 'R'){
              if(deviceInfo.cmd === 'SystemInfo'){
                this.updateVersion(deviceInfo.data);
                this.index++;
                this.switchCmd(deviceInfo.cmd, 'R', this.index);
              }
            }
            if(deviceInfo.rw === 'W'){
              if(!this.isSingle){
                if(this.index === this.selectedOperators.length - 1){
                  this.afterCmdDo(deviceInfo);
                }else {
                  this.index++;
                  this.switchCmd(deviceInfo.cmd, 'W', this.index);
                }
              }else{
                this.afterCmdDo(deviceInfo);
              }
            }
          }
        }else if(deviceInfo.status === 8){
          this.message.setMsg({severity:'error', summary:'Error Message', detail:'设备下线！'});
        }else{
          this.message.setMsg({severity:'error', summary:'Error Message', detail:'操作失败！'});
        }
      }
    })
  }
  /*定时操作*/
  afterCmdDo(deviceInfo){
    this.closeTimeout();
    if(deviceInfo.cmd === 'NewSoftwareInfo'){
      this.oneRequest();
      this.refreshValue();
    }else if(deviceInfo.cmd === 'CancelUpgrade'){
      this.oneRequest();
      if(this.isSingle) this.refreshValue();
    }
  }
  /*获取数据*/
  getList() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize};
    if(!!this.projectId){
      this.update.getSoftwareInfoList(this.projectId,params).subscribe((res) => {
        if (res) {
          this.cranes = this.addVersion(res.data.list,this.center.defaultValue);
          this.total = res.data.total;
          if(this.checkIsRefresh()){
            this.refreshValue()
          }
        }
      })
    }
  }
  /*定时请求*/
  refreshValue(){
    this.refreshMark = setInterval(()=>{
      if(this.isRefresh()){
        this.oneRequest();
      }else{
        this.refreshMark && clearInterval(this.refreshMark);
      }
    },5000);
  }
  /*请求一次*/
  oneRequest(){
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize};
    this.update.getRefreshData(this.projectId,params).subscribe((res) => {
      if (res) {
        this.refreshData(res.data.list);
      }
    })
  }
  /*判断是否还需要刷新*/
  isRefresh(){
    let flag = false;
    for(const item of this.selectedOperators){
      if(!!item.achPackageCount){
        if(item.packageCount !== item.achPackageCount || !item.checkResult){//分包数量和以获取包数相等以及检查结果是true
          flag = true;
        }
      }
    }
    return flag;
  }
  /*定时更新数据*/
  refreshData(data){
    for(const item of data){
      for(const va of this.cranes){
        if(item.sn === va.sn){
          Object.assign(va,item);
        }
      }
    }
  }
  //检查是否需要开启定时(全部完成才关闭否则开启)
  checkIsRefresh(){
    let flag = false;
    for(const item of this.selectedOperators){
      if(item.online && !!item.upgradeVersion && !!item.achPackageCount && item.achPackageCount !== item.packageCount){//条件是：在线、已选版本、获取量不为0，分包和已获取不等
        flag = true;
      }
    }
    return flag;
  }
  /*更新上主机箱版本*/
  updateVersion(version){
    for(const item of this.cranes){
      if(item.sn === version.sn){
        item.currentVersion = version.softwareVersion;
      }
    }
  }
  /*选择版本后添加版本*/
  addVersion(data,version){
    if(!!version){
      for(const item of this.center.selected){
        for(const main of data){
          if(main.craneId === item.craneId){
            main.upgradeVersion = version.softwareVersion;
            main.upgradeVersionExp = version.softwareVersionEx;
            main.upgradeCrc = version.crc;
            main.upgradeSize = version.softwareSize;
            this.selectedOperators.push(main);
          }
        }
      }
    }
    else{
      for(const item of data){
        item.online && this.selectedOperators.push(item);
      }
      this.center.selected = this.selectedOperators;
    }
    return data;
  }
  /*全部操作*/
  switchCmd(cmd,rw,mark){
    this.isSingle = false;
    if(!mark){
      this.index = 0;
      if(!this.checkBegin()) return;
      this.cmd(cmd,rw,this.selectedOperators[0]);
    }else{
      for(let i = this.index; i < this.selectedOperators.length; i++){
        this.cmd(cmd,rw,this.selectedOperators[i]);
      }
    }
  }
  /*单个命令*/
  singleCmd(cmd,rw,item){
    this.isSingle = true;
    this.index = 0;
    this.cmd(cmd,rw,item);
  }
  /*下命令*/
  cmd(cmd,rw,item){
    if(rw === 'W'){
      let params = {};
      if(cmd === 'NewSoftwareInfo'){
        params  ={softwareVersion:item.upgradeVersion,softwareVersionEx:item.upgradeVersionExp,softwareSize:item.upgradeSize,crc:item.upgradeCrc,
          packSize:item.packageSize,packCount:item.packageCount,currentNum:0,checkOk:0};
      }
      this.sendCmd({cmd:cmd,vo:params,craneId:item.craneId,rwStatus:rw});
    }else if(rw === 'R'){
      this.sendCmd({cmd:cmd,craneId:item.craneId,rwStatus:rw});
    }
  }
  /*启动检查*/
  checkBegin(){
    let flag = true;
    if(!this.selectedOperators.length){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'请选中升级项！'});
      return false;
    }
    for(const item of this.selectedOperators){
      if(!item.upgradeVersion){
        flag = false;
      }
    }
    if(!flag){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'请选择升级版本！'});
      return false;
    }
    return true;
  }

  /*分页事件*/
  pageChange(event) {
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0);
  }
  /*选择版本*/
  chooseVersion(){
    this.clickVersionButton = true;
    this.center.selected = this.selectedOperators;
    this.router.navigate(['/layout/antiUpgrade/versions']);
    window.history.replaceState(null,null,`/layout/antiUpgrade/craneList/${this.projectId}`)
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*关闭定时*/
  closeTimeout(){
    this.refreshMark && clearInterval(this.refreshMark);
  }
  ngOnDestroy(){
    if(!this.clickVersionButton) {
      this.center.selected = null;
      this.center.defaultValue = null;
    }
    this.closeTimeout();
    !!this.ws && this.ws.close();
    if(this.showDataSub){
      this.showDataSub.unsubscribe();
    }
  }
}
