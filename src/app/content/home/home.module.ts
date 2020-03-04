import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShareModule} from "../../common/share.module";
import {HomePageService} from "./service/homepage.service";
import {HomeRoutingModule} from "./home-routing.module";
import {HomePageComponent} from "./homepage.component";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ShareModule
  ],
  declarations: [
    HomePageComponent
  ],
  providers:[
    HomePageService
  ]
})
export class HomeModule {
}
