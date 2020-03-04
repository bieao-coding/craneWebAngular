import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {Router} from "@angular/router";
import {PublicService} from "../../../utils/public.service";
import {VideoDeviceListService} from "./service/videoDeviceList.service";

@Component({
  selector:'layout-videoDeviceList',
  templateUrl:'./videoDeviceList.component.html'
})
export class VideoDeviceListComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  devices = [];
  pageNumber = 0;//页码
  controlAuth = {add:false};//本页面的权限
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  searchValue = '';
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,
              private videoDeviceListService:VideoDeviceListService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '视频管理' },
      { label: '设备列表' }
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
  getList() {
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,sn:this.searchValue.trim()};
    this.videoDeviceListService.getDeviceList(params).subscribe((res)=>{
      if(res){
        this.devices = res.data.list;
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
    },0);
  }
  /*查询事件*/
  search(){
    this.getList();
  }
  /*添加工程*/
  addDevice(){
    this.router.navigate(['/layout/videoDevices/deviceAdd'])
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/videoDevices'] ? !!item['/videoDevices'].POST : false;
      this.controlAuth = {add:addAuth};
    }
  }
}
