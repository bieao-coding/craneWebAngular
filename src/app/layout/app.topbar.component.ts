import { Component,OnInit,OnDestroy } from '@angular/core';
import { LayoutComponent } from './layout.component';
import {Router} from "@angular/router";
import {FullScreenService} from "../service/fullScreen.service";
import {ThemeChangeService} from "../service/theme-change.service";
import {LoginService} from "../service/login.service";
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit,OnDestroy{
    docElm:any;
    content:any;
    subScreen:any;
    subTheme:any;
    showFullScreen:any = false;
    loginName = '未知';
    isDark = false;
    showName = true;
    constructor(public app: LayoutComponent,private theme:ThemeChangeService,
                private router:Router,private screen:FullScreenService,private login:LoginService) {
      this.subScreen = this.screen.screenHandler.subscribe((info)=>{
        setTimeout(() => {this.showFullScreen = info});
      });
    }
    ngOnInit(){
      this.noFullScreen();
    }
    /*手机不显示全屏按钮*/
    noFullScreen(){
      if(document.documentElement.clientWidth <= 640){
        this.showName = false;
      }else{
        this.showName = true;
        const name = sessionStorage.getItem('name');
        if(name){
          this.loginName = JSON.parse(name).name;
        }
      }
    }
    themeChange(e) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        const href = themeLink.href;
        const themeFile = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
        const themeTokens = themeFile.split('-');
        const themeMode = themeTokens[1];
        const newThemeMode = (themeMode === 'dark') ? 'light' : 'dark';
        this.isDark = newThemeMode === 'dark';
        this.theme.setTheme(this.isDark);
        this.app.changeTheme(newThemeMode);
    }

    /*全屏事件*/
    fullScreen($event){
      this.docElm = document.documentElement;
      if (this.docElm.requestFullscreen) {
        this.docElm.requestFullscreen();
      }
      else if (this.docElm.msRequestFullscreen) {
        this.docElm.msRequestFullscreen();
      }
      else if (this.docElm.mozRequestFullScreen) {
        this.docElm.mozRequestFullScreen();
      }
      else if (this.docElm.webkitRequestFullScreen) {
        this.docElm.webkitRequestFullScreen();
        this.fullResolve($event);
      }
    }
    /*全屏处理*/
    fullResolve($event){
      this.app.onMenuButtonClick($event,1);
      //this.router.navigate(['/layout/empty']);
    }
    /*退出*/
    logout(){
      this.login.LoginOut().subscribe((res)=>{
        if(res.status === 10){
          sessionStorage.removeItem('info');
          sessionStorage.removeItem('active');
          sessionStorage.removeItem('menu');
          sessionStorage.removeItem('name');
          this.router.navigate(['/empty'])
        }
      })

    }
    ngOnDestroy() {
      if (this.subScreen) {
        this.subScreen.unsubscribe();
      }
    }
}
