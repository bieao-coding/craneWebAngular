import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import {Router,ActivatedRoute} from "@angular/router";
import {PublicService} from "../../../../utils/public.service";
import {UpdateService} from "../service/update.service";
import {VersionCenterService} from "../service/version-center.service";

declare var $:any;
@Component({
  selector:'layout-versionList',
  templateUrl:'./versionList.component.html',
})
export class VersionListComponent implements OnInit {
  maxHeight:number = window.innerHeight-86-40-47-47;
  versions = [];
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10, 20, 30];//分页码
  searchValue = '';
  searchEvent: HTMLElement;
  index = -1;
  isPh = false;
  flowStyle = {};
  projectId;
  selectedProject = {};
  constructor(private breadcrumbService: BreadcrumbService, private pu: PublicService, private router: Router, private route: ActivatedRoute,
              private update: UpdateService,private center:VersionCenterService) {
    this.breadcrumbService.setItems([
      {label: '工程列表', routerLink: ['/layout/antiUpgrade']},
      {label: '版本列表'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    this.surePcOrPh();
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
    const params = {pageNumber: this.pageNumber, pageSize: this.pageSize};
    this.update.getVersionList(params).subscribe((res) => {
      if (res) {
        this.versions = res.data.list;
        this.total = res.data.total;
      }
    })
  }
  /*选择版本*/
  chooseVersion(version){
    this.center.defaultValue = version;
    window.history.go(-1);
  }
  /*分页事件*/
  pageChange(event) {
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
}
