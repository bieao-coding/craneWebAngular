import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import {OnlineRoutingModule} from "./online-routing.module";
import {CalendarModule} from "primeng/primeng";
import { TableModule } from 'primeng/table';
import {TreeModule} from "primeng/tree";
import { TabViewModule } from 'primeng/primeng';
import {SliderModule} from "primeng/slider";
import {InputTextModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {OnlineMonitorComponent} from "./onlinemonitor.component";
import {RunDataComponent} from "./monitorcontent/rundata.component";
import {WorkDataComponent} from "./monitorcontent/workdata.component";
import {RunTimeComponent} from "./monitorcontent/runtime.component";
import {VideoRunTimeComponent} from "./monitorcontent/videoruntime.component";
import {LiveVideoComponent} from "./monitorcontent/livevideo.component";
import {CraneSpreadComponent} from "./monitorcontent/cranespread.component";
import {RecordedVideoComponent} from "./monitorcontent/recordedvideo.component";
import {SideViewPingComponent} from "./monitorcontent/sideviewPing.component";
import {SideViewDongComponent} from "./monitorcontent/sideviewDong.component";
import {OnlineMonitorService} from "./service/onlinemonitor.service";
@NgModule({
  imports: [
    CommonModule,
    OnlineRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
    TableModule,
    TreeModule,
    TabViewModule,
    SliderModule,
    InputTextModule,
    ShareModule
  ],
  declarations: [
    OnlineMonitorComponent,
    RunDataComponent,
    WorkDataComponent,
    RunTimeComponent,
    VideoRunTimeComponent,
    LiveVideoComponent,
    CraneSpreadComponent,
    RecordedVideoComponent,
    SideViewPingComponent,
    SideViewDongComponent
  ],
  providers:[
    OnlineMonitorService
  ]
})
export class OnlineModule {
}
