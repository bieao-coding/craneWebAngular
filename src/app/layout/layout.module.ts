import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutRoutingModule} from "./layout-routing.module";
import {ScrollPanelModule} from 'primeng/primeng';
import {BlockUIModule} from "primeng/blockui";
import {GrowlModule} from "primeng/growl";
import {ButtonModule} from "primeng/button";
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {DialogComponent} from "../utils/dialog.component";
import {AppBreadcrumbComponent} from "./app.breadcrumb.component";
import {AppTopBarComponent} from "./app.topbar.component";
import {LayoutMenuComponent, LayoutSubMenuComponent} from "./menu.component";
import {LayoutComponent} from "./layout.component";
import {NoHomePageComponent} from "./noHomePage.component";
import {DatePipe} from "@angular/common";
import {DialogService} from "../service/dialog.service";
import {PublicService} from "../utils/public.service";
import { BreadcrumbService } from '../service/breadcrumb.service';
import {FullScreenService} from "../service/fullScreen.service";
import {ThemeChangeService} from "../service/theme-change.service";
import {LayoutService} from "./service/layout.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScrollPanelModule,
    LayoutRoutingModule,
    BlockUIModule,
    GrowlModule,
    ButtonModule,
    InputSwitchModule
  ],
  declarations: [
    LayoutMenuComponent,
    LayoutSubMenuComponent,
    LayoutComponent,
    AppBreadcrumbComponent,
    AppTopBarComponent,
    DialogComponent,
    NoHomePageComponent,
  ],
  providers:[
    BreadcrumbService,
    DialogService,
    PublicService,
    FullScreenService,
    ThemeChangeService,
    DatePipe,
    LayoutService
  ]
})
export class LayoutModule {
}
