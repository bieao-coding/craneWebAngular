import {Component,OnInit} from "@angular/core";
import {BreadcrumbService} from "../../../service/breadcrumb.service";
import {AntiVersionManageService} from "./service/antiversionmanage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "../../../service/dialog.service";

@Component({
  selector:'layout-antiVersionManage',
  templateUrl:'./antiversionmanage.component.html'
})
export class AntiVersionManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  versions = [];
  pageNumber = 0;//页码
  controlAuth = {add:false,delete:false};//本页面的权限
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  versionName = '';
  searchEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  selectRow:any;
  constructor(private breadcrumbService: BreadcrumbService,private route: ActivatedRoute,private dialogService:DialogService,
              private versionService:AntiVersionManageService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '防撞管理' },
      { label: '防撞版本管理' }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.surePcOrPh();
    this.getAuth();
    this.getList();
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
  /*获取数据*/
  getList(){
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,softwareName:this.versionName.trim()};
    this.versionService.getAntiVersionList(params).subscribe((res)=>{
      if(res){
        this.versions = res.data.list;
        this.total = res.data.total;
      }
    })
  }
  /*分页事件*/
  pageChange(event){
    setTimeout(()=>{
      this.pageSize = event.rows;
      this.pageNumber = event.page;
      this.getList();
    },0)
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*添加单位*/
  addVersion(){
    this.router.navigate(['/layout/antiVersions/add'])
  }

  doSoming(){
    return ($event)=>{
      this.dialogService.setDialog({showDialog:false});
      if($event === true) this.versionService.deleteAntiVersion(this.selectRow.softwareId).subscribe((rep)=>{
        if(!rep.status) this.getList();
      });
    }
  }

  /*删除*/
  delete(row){
    if(!row) return;
    this.selectRow = row;
    this.dialogService.setDialog({message:'确认删除这条信息吗？',showDialog:true,doSoming:this.doSoming()})
  }

  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/antiVersions'] ? !!item['/antiVersions'].POST : false;
      const deleteAuth = item['/antiVersions/{softwareId}'] ? !!item['/antiVersions/{softwareId}'].DELETE : false;
      this.controlAuth = {add:addAuth,delete:deleteAuth};
    }
  }
}
