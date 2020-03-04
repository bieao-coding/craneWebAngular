import {Component,OnInit,Input} from "@angular/core";
import { BreadcrumbService } from '../../service/breadcrumb.service';
import {ActivatedRoute, Router} from "@angular/router";
import {PublicService} from "../../utils/public.service";
import {MenuService} from "./service/menu.service";
import {DialogService} from "../../service/dialog.service";

@Component({
  selector:'layout-menumanage',
  templateUrl:'./menumanage.component.html'
})
export class MenuManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40;
  menus = [];
  controlAuth = {add:false,edit:false,delete:false,number:60};//本页面的权限
  companyName = '';
  searchEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  selectRow:any;
  constructor(private breadcrumbService: BreadcrumbService,private pu:PublicService,private route: ActivatedRoute,private dialogService:DialogService,
              private menuService:MenuService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '菜单管理'}
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
    this.menuService.getMenuList().subscribe((res)=>{
      if(res){
        this.menus = this.pu.transformTreeTable({id:'id',pid:'parentId',children:'children'},res.data);
      }
    })
  }
  doSoming(){
    return ($event)=>{
      this.dialogService.setDialog({showDialog:false});
      if($event === true) this.menuService.deleteMenu(this.selectIds([this.selectRow],[]).toString()).subscribe((rep)=>{
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
  selectIds(row,array){
    for(const item of row){
      if(item.data){
        array.push(item.data.id);
      }
      if(item.children){
        this.selectIds(item.children,array);
      }
    }
    return array;
  }
  /*具体操作分配*/
  operations(name,index){
    this.router.navigate([`/layout/menu/${name}/${index}`]);
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const addAuth = item['/menu'] ? !!item['/menu'].POST : false;
      const editAuth = item['/menu/{id}'] ? !!item['/menu/{id}'].GET : false;
      const deleteAuth = item['/menu'] ? !!item['/menu'].DELETE : false;
      this.controlAuth = {add:addAuth,edit:editAuth,delete:deleteAuth,number:60};
      let i = 0;
      for(const value in this.controlAuth){
        if(value !== 'number' && this.controlAuth[value]){
          i++;
        }
      }
      if(!!i) this.controlAuth.number = i * 60 + 10;
    }
  }
}
