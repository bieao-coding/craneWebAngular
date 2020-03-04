import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DeviceListComponent} from "./deviceList.component";
import {DeviceFormComponent} from "./antiform/deviceForm.component";

const routes: Routes = [
  {path: '', component: DeviceListComponent},
  {path: 'deviceAdd', component: DeviceFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceListRoutingModule {
}
