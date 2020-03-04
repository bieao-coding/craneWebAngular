import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
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
const routes: Routes = [
  {path: '', component: OnlineMonitorComponent},
  {path: ':projectId/rundata', component: RunDataComponent},
  {path: ':projectId/workdata', component: WorkDataComponent},
  {path: ':projectId/runtime', component: RunTimeComponent},
  {path: ':projectId/videoruntime', component: VideoRunTimeComponent},
  {path: ':projectId/livevideo', component: LiveVideoComponent},
  {path: ':projectId/cranespread', component: CraneSpreadComponent},
  {path: ':projectId/recordedvideo', component: RecordedVideoComponent},
  {path: ':projectId/sideviewPing', component: SideViewPingComponent},
  {path: ':projectId/sideviewDong', component: SideViewDongComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineRoutingModule {
}
