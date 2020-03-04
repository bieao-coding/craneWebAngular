import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CompanyFormComponent} from "./companymanage/companyform.component";
import {CompanyManageComponent} from "./companymanage.component";

const routes: Routes = [
  {path: '', component: CompanyManageComponent},
  {path: 'companyadd', component: CompanyFormComponent},
  {path: 'companyedit/:id', component: CompanyFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
