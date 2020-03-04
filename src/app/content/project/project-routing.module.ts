import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProjectManageComponent} from "./projectmanage.component";
import {ProjectFormComponent} from "./projectmanage/projectform.component";


const routes: Routes = [
  {path: '', component: ProjectManageComponent},
  {path: 'projectadd', component: ProjectFormComponent},
  {path: 'projectedit/:id', component: ProjectFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
