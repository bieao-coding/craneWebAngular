import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuManageComponent} from "./menumanage.component";
import {MenuFormComponent} from "./menu-form/menu-form.component";

const routes: Routes = [
  {path: '', component: MenuManageComponent},
  {path: 'menuadd/:parentId', component: MenuFormComponent},
  {path: 'menuedit/:id', component: MenuFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {
}
