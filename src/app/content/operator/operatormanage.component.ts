import {Component,OnInit} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {OperatorManageService} from "./service/operatormanage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicService} from "../../utils/public.service";
import {DialogService} from "../../service/dialog.service";

@Component({
  selector:'layout-operatormanage',
  templateUrl:'./operatormanage.component.html'
})
export class OperatorManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  operators = [];
  pageNumber = 0;//页码
  controlAuth = {add:false,edit:false,feature:false,delete:false,number:60};//本页面的权限
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  searchValue = '';
  searchEvent:HTMLElement;
  selectedOperator = {};
  isPh = false;
  flowStyle = {};
  selectRow:any;
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,
              private operatorService:OperatorManageService,private router:Router,private dialogService:DialogService){
    this.breadcrumbService.setItems([
      { label: '基础管理' },
      { label: '人员管理' },
    ]);
  }
  /*初始项*/
  ngOnInit(){
    this.backPageNum();
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
  /*返回选中*/
  backSelect() {
    if (this.route.snapshot.queryParams.index) {
      for(const item of this.operators){
        if(item.personalId === parseInt(this.route.snapshot.queryParams.index)){
          this.selectedOperator = item;
        }
      }
    }
  }
  /*返回页数*/
  backPageNum(){
    if (this.route.snapshot.queryParams.pageNumber) {
      this.pageNumber = parseInt(this.route.snapshot.queryParams.pageNumber);
    }
  }
  /*获取数据*/
  getList(){
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,search:this.searchValue.trim()};
    this.operatorService.getOperatorList(params).subscribe((res)=>{
      if(res){
        this.operators = res.data.list;
        this.total = res.data.total;
        this.backSelect();
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
  addOperator(){
    this.router.navigate(['/layout/personals/operatoradd'])
  }
  /*具体操作分配*/
  operations(name,index,idCard){
    if(!idCard) this.router.navigate([`/layout/personals/${name}/${index}`]);
    else this.router.navigate([`/layout/personals/${name}/${idCard}`]);
    window.history.replaceState(null,null,`/layout/personals?index=${index}&pageNumber=${this.pageNumber}`)
  }
  doSoming(){
    return ($event)=>{
      this.dialogService.setDialog({showDialog:false});
      if($event === true) this.operatorService.deleteOperator(this.selectRow).subscribe((rep)=>{
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
      const addAuth = item['/personals'] ? !!item['/personals'].POST : false;
      const editAuth = item['/personals/{personalId}'] ? !!item['/personals/{personalId}'].GET : false;
      const deleteAuth = item['/personals/{personalId}'] ? !!item['/personals/{personalId}'].DELETE : false;
      const featureAuth = item['/personals/{identityCard}/features'] ? !!item['/personals/{identityCard}/features'].GET : false;
      this.controlAuth = {add:addAuth,edit:editAuth,feature:featureAuth,delete:deleteAuth,number:60};
      let i = 0;
      for(const value in this.controlAuth){
        if(value !== 'add' && value !== 'number' && this.controlAuth[value]){
          i++;
        }
      }
      if(!!i) this.controlAuth.number = i * 60 + 10;
    }
  }
}
