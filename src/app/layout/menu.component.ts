import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LayoutComponent } from './layout.component';
import {LayoutService} from "./service/layout.service";
import {PublicService} from "../utils/public.service";

@Component({
  selector: 'layout-menu',
  template: `
        <ul layout-submenu [item]="model" root="true" class="layout-menu" [reset]="reset" visible="true" parentActive="true"></ul>
    `
})
export class LayoutMenuComponent implements OnInit {

  @Input() reset: boolean;

  auth:any;
  authObj:any = {};
  menu:any = [];
  menuObj:any = {};
  model: any[] = [];
  constructor(public app: LayoutComponent,private layout:LayoutService,private pu:PublicService) { }

  ngOnInit() {
    // this.model = [
    //   { path:'index',name: '首页', icon: 'fa fa-fw fa-home', root: ['/layout'],index:0,visible:true },
    //   { path:'system', name: '系统管理', icon: 'fa fa-fw fa-cog', index:1,visible:true,
    //     children: [
    //       { path:'users', name: '用户管理', icon: 'fa fa-fw fa-user', root: ['/layout/usermanage'],index:2,visible:true },
    //       { path:'roles', name: '角色管理', icon: 'fa fa-fw fa-lock', root: ['/layout/rolemanage'],index:3,visible:true },
    //       { path:'menus', name: '菜单管理', icon: 'fa fa-fw fa-th-large', root: ['/layout/menu'],index:4,visible:true }
    //     ]
    //   },
    //   {  path:'base', name: '基础管理', icon: 'fa fa-fw fa-database',index:5,visible:true,
    //     children: [
    //       {  path:'companies', name: '单位管理', icon: 'fa fa-fw fa-tags', root: ['/layout/companymanage'],index:6,visible:true },
    //       {  path:'projects', name: '工程管理', icon: 'fa fa-fw fa-sitemap', root: ['/layout/projectmanage'],index:7 ,visible:true},
    //       {  path:'craneFactories', name: '塔机型号', icon: 'fa fa-fw fa-code-fork', root: ['/layout/cranetype'],index:8,visible:true },
    //       {  path:'operators', name: '人员管理', icon: 'fa fa-fw fa-address-card', root: ['/layout/operatormanage'],index:9,visible:true }
    //     ]
    //   },
    //   { path:'business/craneManager', name: '塔机管理', icon: 'fa fa-fw fa-wrench', root: ['/layout/cranemanage'],index:10,visible:true },
    //   { path:'business/dataMonitoring', name: '在线监控', icon: 'fa fa-fw fa-video-camera', root: ['/layout/onlinemonitor'],index:11,visible:true },
    //   { path:'business/deviceManager', name: '设备管理', icon: 'fa fa-fw fa-server',index:12,visible:true,
    //     children: [
    //       { path:'antiCollision', name: '防撞管理', icon: 'fa fa-fw fa-exclamation-circle',index:13,visible:true,
    //         children:[
    //           { path:'devices', name:'设备列表',icon: 'fa fa-fw fa-list', root: ['/layout/deviceManage/antiCollision/devices'],index:14,visible:true},
    //           { path:'versions', name:'版本管理',icon: 'fa fa-fw fa-book', root: ['/layout/deviceManage/antiCollision/versions'],index:15,visible:true},
    //           { path:'params', name:'参数设置',icon: 'fa fa-fw fa-gears', root: ['/layout/deviceManage/antiCollision/paramsSetting'],index:16,visible:true}
    //         ]
    //       },
    //
    //       { path:'video', name: '视频管理', icon: 'fa fa-fw fa-film',index:17,visible:true,
    //         children:[
    //           { path:'devices',name:'设备列表',icon: 'fa fa-fw fa-list', root: ['/layout/deviceManage/video/devices'],index:18,visible:true},
    //           { path:'versions', name:'版本管理',icon: 'fa fa-fw fa-book', root: ['/layout/deviceManage/video/versions'],index:19,visible:true}
    //         ]
    //       }
    //     ]
    //   }
    // ];
    this.getAuthList();
    /*菜单权限控制注意两点：1.path一定要写 2.新添加的visible必须是false,会在匹配权限时修改为true*/
  }
  /*获取权限列表*/
  getAuthList(){
    this.layout.getAuthAndMenu().subscribe(res=>{
      if(res){
        this.auth = this.resolveAuth(res.data.resource);
        this.menu = res.data.menuTree;
        sessionStorage.setItem('info', JSON.stringify({auth: this.auth}));
        this.menuShow();
      }
    })
  }
  /*处理auth*/
  resolveAuth(auth){
    const obj = {};
    for(const item of auth){
      const newUrl = item.url.replace('/restful/v1','');
      const firstIndex = newUrl.indexOf('/',1) === -1 ? newUrl.length : newUrl.indexOf('/',1);
      if(!this.authObj[newUrl.substring(1,firstIndex)]){
        this.authObj[newUrl.substring(1,firstIndex)] = true;
      }
      if(!!obj[newUrl]){
        const method = {};
        method[item.method] = true;
        obj[newUrl] = Object.assign(obj[newUrl],method);
      }else{
        const value = {};
        value[item.method] = true;
        obj[newUrl.replace('/restful/v1','')] = value;
      }
    }
    return obj;
  }
  /*处理菜单显示*/
  menuShow(){
    const lastShowIds = [];
    const newAuth = {};
    for(const item of this.menu){
      this.menuObj[item.id] = {id:item.id,parentId:item.parentId,visible:false};
      item.icon = 'fa fa-fw ' + item.icon;
      if(item.type && !!item.root){
        const firstIndex = item.root.indexOf('/',1) + 1;
        const lastIndex = item.root.lastIndexOf('/') + 1;
        const newRoot = item.root.replace(item.root.substring(firstIndex,lastIndex),'');
        if(this.authObj[item.root.substring(lastIndex)]){
          this.authObj[item.root.substring(lastIndex)] = item.name;
          item.root = [newRoot];
          lastShowIds.push(item.id);
        }
      }
    }
    for(const id of lastShowIds){
      this.findParentId(id);
    }
    for(const item of this.menu){
      if(this.menuObj[item.id]){
        item.visible = this.menuObj[item.id].visible;
      }
    }
    for(const item in this.authObj){
      if(this.pu.typeof(this.authObj[item]) === 'String'){
        newAuth[item] = this.authObj[item];
      }
    }
    sessionStorage.setItem('menu', JSON.stringify({menu: newAuth}));
    this.model = this.pu.transformMenuList({id:'id',pid:'parentId',children:'children'},this.menu);
  }

  findParentId(id){
    this.menuObj[id].visible = true;
    if(this.menuObj[this.menuObj[id].parentId]){
      this.findParentId(this.menuObj[id].parentId);
    }
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[layout-submenu]',
  /* tslint:enable:component-selector */
  template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.children)">
            <li [ngClass]="{'active-menuitem': isActive(child.id)}" *ngIf="child.visible">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,child.id)" (mouseenter)="onMouseEnter(i)" *ngIf="!child.root">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.name}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.children"></i>
                </a>

                <a (click)="itemClick($event,child,child.root.indexOf('index') !== -1 ? 0 : child.id)" (mouseenter)="onMouseEnter(i)" *ngIf="!!child.root"
                    [routerLink]="child.root" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.name}}</span>
                    <i class="fa fa-fw fa-angle-down" *ngIf="child.children"></i>
                </a>
                <ul layout-submenu [item]="child" *ngIf="child.children" [visible]="isActive(child.id)" [reset]="reset" [parentActive]="isActive(child.id)"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(child.id) ?
                    'visible' : 'hidden' : isActive(child.id) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
  animations: [
    trigger('children', [
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class LayoutSubMenuComponent {

  @Input() item;

  @Input() root: boolean;

  @Input() visible: boolean;

  _parentActive: boolean;

  _reset: boolean;

  activeIndex: number = sessionStorage.getItem('active') ? JSON.parse(sessionStorage.getItem('active')).index : 0;

  constructor(public app: LayoutComponent) { }

  itemClick(event: Event, item, index)  {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? this.activeIndex : index;
    sessionStorage.setItem('active',JSON.stringify({index:this.activeIndex}));
    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // prevent hash change
    if (item.children || (!item.url && !item.root)) {
      setTimeout(() => {
        this.app.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.children) {
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
      && !this.app.isMobile() && !this.app.isTablet()) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() ||  this.app.isSlim())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }
}
