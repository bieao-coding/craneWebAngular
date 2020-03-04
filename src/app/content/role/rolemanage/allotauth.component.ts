import {Component,OnInit,Input} from "@angular/core";
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import {ActivatedRoute,Router} from "@angular/router";
import {RoleManageService} from "../service/rolemanage.service";
import {PublicService} from "../../../utils/public.service";
import {TreeNode} from "primeng/api";
@Component({
  selector:'layout-allotauth',
  templateUrl:'./allotauth.component.html'
})
export class AllotAuthComponent implements OnInit{
  maxHeight:number = window.innerHeight-50-42-40-40;
  formAuth = {save:false};//本页面的权限
  allAuth:TreeNode[] = [];
  selectedList = [];
  dataArray = [];
  id:number|string;
  flowStyle = {};
  constructor(private breadcrumbService: BreadcrumbService,private route: ActivatedRoute,private roleService:RoleManageService,
              private pu:PublicService,private router:Router){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '角色管理', routerLink: ['/layout/roles']},
      { label: `权限设置`}
    ]);
  }
  /*初始项*/
  ngOnInit() {
    this.surePcOrPh();
    this.getAuth();
    this.getAllAuth();
  }
  /*区别手机和电脑*/
  surePcOrPh(){
    if(document.getElementById('main').clientWidth <= 640){
      this.flowStyle = {'overflow':'auto'};
    }else{
      this.flowStyle = {'max-height.px':this.maxHeight,'overflow':'auto'};
    }
  }
  /*去除首页的url*/
  chooseIndexUrl(data:Array<any>){
    const index = [];
    for(const item of data){
      for(const cmd in item){
        if(typeof item[cmd] !== 'number'){
            for(const val in item[cmd]){
              index.push(item[cmd][val]);
            }
        }else{
          index.push(item[cmd]);
        }
      }
    }
    return index;
  }
  /*获取整个树*/
  getAllAuth(){
    this.id = this.route.snapshot.paramMap.get('id');
    this.roleService.getAllAuth(this.id).subscribe((res)=>{
        this.allAuth = this.pu.transTree(res[0].data.rootNode.restful.v1,[]);
        const indexUrls = this.chooseIndexUrl([res[0].data.rootNode.restful.v1.index,res[0].data.rootNode.restful.v1.userPageAuth]);
        this.dataArray = [...res[1].data,...indexUrls];
        this.checkNode(this.allAuth, this.dataArray);
    });
  }
  /*默认选中的方法*/
  checkNode(nodes:TreeNode[], str:string[]){
    for(let i=0 ; i < nodes.length ; i++){
      if(nodes[i].children){
        this.checkNode(nodes[i].children,str);
        let count = 0;
        let partialNum = 0;
        for(const item of nodes[i].children){
          if(this.selectedList.includes(item)){
            count++;
          }
          if(item.partialSelected) partialNum++;
        }
        if(count === nodes[i].children.length){
          nodes[i].partialSelected = false;
          this.selectedList.push(nodes[i]);
        }else if(count !== 0 || partialNum !== 0){
          nodes[i].partialSelected = true;
        }
      }else{
        if (str.includes(nodes[i].data)) {
          if (!this.selectedList.includes(nodes[i])) {
            this.selectedList.push(nodes[i]);
          }
        }
      }
    }
  }
  /*保存*/
  submit(){
    const params = [];
    for(const item of this.selectedList){
      if(!!item.data){
        params.push(item.data);
      }
    }
    this.roleService.saveAuth(this.id,'[' + params.toString() + ']').subscribe((rep) => {
      if(!rep.status) window.history.go(-1);
    })
  }
  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/roles/{roleId}/authorities'] ? !!item['/roles/{roleId}/authorities'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
