import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {OperatorManageService} from "../service/operatormanage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector:'layout-featureinfo',
  templateUrl:'./featureInfo.component.html'
})
export class FeatureInfoComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40;
  features = [];
  searchValue = '';
  flowStyle = {};
  idCard:any;
  constructor(private breadcrumbService: BreadcrumbService,private route: ActivatedRoute,
              private operatorService:OperatorManageService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '人员列表', routerLink: ['/layout/personals']},
      { label: `人员特征` }
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.surePcOrPh();
    this.getList();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*获取数据*/
  getList(){
    if(this.route.snapshot.paramMap.has('id')){
      this.idCard = this.route.snapshot.paramMap.get('id');
      this.operatorService.getOperatorFeature(this.idCard).subscribe((res)=>{
        if(res){
          this.features = !!res.data.identityCard && [res.data];
        }
      });
    }
  }
  /*查询事件*/
  search(){
    this.getList();
  }
}
