import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RoleManageComponent} from "./rolemanage.component";
import {RoleFormComponent} from "./rolemanage/roleform.component";
import {AllotAuthComponent} from "./rolemanage/allotauth.component";

const routes: Routes = [
  {path: '', component:RoleManageComponent},
  {path: 'roleadd', component: RoleFormComponent},
  {path: 'roleedit/:id', component: RoleFormComponent},
  {path: 'roleauth/:id', component: AllotAuthComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {
}
