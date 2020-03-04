import { Component} from '@angular/core';

@Component({
  selector: 'app-noFound',
  template: `
    <h2 class="all-center"><a routerLink="/empty"><< 返回登录页</a>&nbsp;&nbsp;页面飞走了...</h2>
  `
})
export class NoFoundPageComponent {
  constructor(){
  }

}
