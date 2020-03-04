import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ParamsProjectListComponent} from "./paramsProjectList.component";
import {ParamsSettingComponent} from "./params/params-setting.component";
import {CraneGroupComponent} from "./params/craneGroup/craneGroup.component";

const routes: Routes = [
  {path: '', component: ParamsProjectListComponent},
  {path: ':id/setParams/:craneId', component: ParamsSettingComponent},
  {path: 'setParams/craneGroup', component: CraneGroupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParamsRoutingModule {
}
