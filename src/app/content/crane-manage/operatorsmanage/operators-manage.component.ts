import {Component,OnInit} from "@angular/core";
import {CraneManageService} from "../service/cranemanage.service";
import {BreadcrumbService} from "../../../service/breadcrumb.service";
import {ActivatedRoute,Router} from "@angular/router";
import {MessageService} from "../../../service/message.service";

@Component({
  selector:'layout-operatormanage',
  templateUrl:'./operators-manage.component.html'
})
export class OperatorsManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47;
  operators:any[] = [];
  oldData = [];
  formAuth = {save:false};//本页面的权限
  searchName = '';
  selectedOperators = [];
  projectId:string|number;
  craneId:string|number;
  searchEvent:HTMLElement;
  flowStyle = {};
  constructor(private craneService:CraneManageService,private breadcrumbService:BreadcrumbService,private router:Router,
              private route:ActivatedRoute,private message:MessageService){
    this.breadcrumbService.setItems([
      { label: '塔机管理' , routerLink: ['/layout/craneManager']},
      { label: `塔司管理` }
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
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*获取用户id*/
  getList(){
    if(this.route.snapshot.paramMap.has('id') && this.route.snapshot.paramMap.has('craneId')){
      this.projectId = this.route.snapshot.paramMap.get('id');
      this.craneId = this.route.snapshot.paramMap.get('craneId');
      this.craneService.getCraneOperatorList(this.projectId,this.craneId).subscribe((res)=>{
        if(res){
          this.oldData = res.data.All;
          this.operators = this.oldData;
          this.selectedOperators = res.data.Bind;
        }
      })
    }
  }
  /*提交*/
  submit(){
    if(this.selectedOperators.length > 10){
      this.message.setMsg({severity:'error', summary:'Error Message', detail:'塔机操作员不能超过10人！'});
      return;
    }
    this.craneService.bindOperators(this.projectId,this.craneId,this.selectedOperators).subscribe((res)=>{
      if(!res.status){
        window.history.go(-1);
      }
    })
  }
  /*查询*/
  search(){
    this.operators = this.oldData.filter((value)=>{
      return !this.searchName || value.personalName.indexOf(this.searchName) !== -1 || value.identityCard.indexOf(this.searchName) !== -1;
    })
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/craneManager/{projectId}/cranes/{craneId}/personals'] ? !!item['/craneManager/{projectId}/cranes/{craneId}/personals'].POST : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
