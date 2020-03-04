import {Component,OnInit} from "@angular/core";
import {UserManageService} from "../service/usermanage.service";
import {BreadcrumbService} from "../../../service/breadcrumb.service";
import {ActivatedRoute,Router} from "@angular/router";
@Component({
  selector:'layout-project',
  templateUrl:'./userprojectmanage.component.html'
})
export class UserProjectManageComponent implements OnInit{
  maxHeight:number = window.innerHeight-86-40-40-47-46;
  projectData:any[] = [];
  formAuth = {save:false};//本页面的权限
  pageNumber = 0;//页码
  pageSize = 10;//每页个数
  total = 0;//总数
  options = [10,20,30];//分页码
  searchName = '';
  selectedProject = [];
  id:string|number;
  selectUser = {};
  searchEvent:HTMLElement;
  inputEvent:HTMLElement;
  isPh = false;
  flowStyle = {};
  firstRequest = true;
  constructor(private userManageService:UserManageService,private breadcrumbService:BreadcrumbService,private router:Router,
              private route:ActivatedRoute){
    this.breadcrumbService.setItems([
      { label: '系统管理' },
      { label: '用户管理', routerLink: ['/layout/users']},
      { label: `工程选择` }
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
  /*获取用户id*/
  getList(){
    this.id = this.route.snapshot.paramMap.get('id');
    const params = {pageNumber:this.pageNumber,pageSize:this.pageSize,search:this.searchName.trim()};
    this.userManageService.getProjectList(this.id,params).subscribe((res)=>{
      if(res){
        this.selectUser = res[0].data;
        this.projectData = res[1].data.list;this.total =res[1].data.total;
        if(this.firstRequest) this.selectedProject = this.selectUser['projectList'];
        this.firstRequest = false;
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
  /*提交*/
  submit(){
    this.selectUser['projectList'] = this.selectedProject;
    this.userManageService.editUser(this.selectUser).subscribe((rep)=>{
      if(rep){
        if(!rep.status) window.history.go(-1);
      }
    })
  }
  /*查询*/
  search(){
    this.getList();
  }

  /*获取权限*/
  getAuth(){
    const auth = JSON.parse(sessionStorage.getItem('info'));
    if(!!auth){
      const item = auth.auth;
      const saveAuth = item['/users/{userId}'] ? !!item['/users/{userId}'].PUT : false;
      this.formAuth = {save:saveAuth};
    }
  }
}
