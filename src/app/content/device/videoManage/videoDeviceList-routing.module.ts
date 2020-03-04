import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VideoDeviceListComponent} from "./videoDeviceList.component";
import {VideoDeviceFormComponent} from "./videoform/videoDeviceForm.component";

const routes: Routes = [
  {path: '', component: VideoDeviceListComponent},
  {path: 'deviceAdd', component: VideoDeviceFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoDeviceListRoutingModule {
}
