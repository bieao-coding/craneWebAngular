import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {ScrollPanel} from 'primeng/primeng';
import {LoadingService} from "../service/loading.service";
import { Subscription } from 'rxjs/Subscription';
import {Message} from "primeng/api";
import {MessageService} from "../service/message.service";
import {DialogService} from "../service/dialog.service";
import {Dialog} from "../domain/dialog";
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements AfterViewInit,OnDestroy {
  /*遮罩层*/
  loading:Boolean  = false;
  subLoading: Subscription;
  /*消息*/
  msgs:Message[] = [];
  subMessage:Subscription;
  /*提示弹窗*/
  info:Dialog = {
    message:'',
    showDialog:false,
    doSoming:''
  };
  subDialog: Subscription;

  darkTheme = true;

  menuMode = 'static';

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  layoutMenuScroller: HTMLDivElement;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  resetMenu: boolean;

  menuHoverActive: boolean;

  isScreen = false;
  @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ScrollPanel;
  constructor(private loadingService: LoadingService,private msgService:MessageService,private dialogService:DialogService){
  }
  ngAfterViewInit() {
    setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 100);
    this.subLoading = this.loadingService.loadHandler.subscribe((state)=>{
      setTimeout(() => {this.loading = state;});
    });
    this.subMessage = this.msgService.messageHandler.subscribe((msg)=>{
      setTimeout(() => {this.msgs.push(msg)});
      setTimeout(()=>this.msgs = [],2000);
    });
    this.subDialog = this.dialogService.dialogHandler.subscribe((info:Dialog)=>{
      setTimeout(() => {this.info = info});
    });
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.activeTopbarItem = null;
      this.topbarMenuActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.resetMenu = true;
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
  }

  onMenuButtonClick(event,state) {
    if(state){
      if(this.staticMenuDesktopInactive){
        this.isScreen = true;
        return;
      }
    }
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }
    if(state){
      this.isScreen = true;
    }else{
      this.isScreen = false;
    }
    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;

    if (!this.isHorizontal()) {
      setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 500);
    }
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  onTopbarSubItemClick(event) {
    event.preventDefault();
  }

  isHorizontal() {
    return this.menuMode === 'horizontal';
  }

  isSlim() {
    return this.menuMode === 'slim';
  }

  isOverlay() {
    return this.menuMode === 'overlay';
  }

  isStatic() {
    return this.menuMode === 'static';
  }

  isMobile() {
    return window.innerWidth < 1025;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.href = 'assets/theme/theme-' + theme + '.css';
    if (theme.indexOf('dark') !== -1) {
      this.darkTheme = true;
    } else {
      this.darkTheme = false;
    }
  }
  ngOnDestroy() {
    if (this.subLoading) {
      this.subLoading.unsubscribe();
    }
    if (this.subMessage) {
      this.subMessage.unsubscribe();
    }
    if (this.subDialog) {
      this.subDialog.unsubscribe();
    }
  }
}
