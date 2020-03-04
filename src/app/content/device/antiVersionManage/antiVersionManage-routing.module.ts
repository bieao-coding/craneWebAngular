import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AntiVersionManageComponent} from "./antiversionmanage.component";
import {AntiVersionFormComponent} from "./versionform/antiversionform.component";

const routes: Routes = [
  {path: '', component: AntiVersionManageComponent},
  {path: 'add', component: AntiVersionFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntiVersionManageRoutingModule {
}
