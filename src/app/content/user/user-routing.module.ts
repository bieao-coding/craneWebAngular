import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserManageComponent} from "./usermanage.component";
import {UserformComponent} from "./usermanage/userform.component";
import {UserProjectManageComponent} from "./userprojectmanage/userprojectmanage.component";
import {ModifyPasswordComponent} from "./password/modifyPassword.component";

const routes: Routes = [
  {path: '', component:UserManageComponent},
  {path:'useredit/:id', component: UserformComponent},
  {path:'useradd',component: UserformComponent},
  {path:'modifyPassword/:id',component: ModifyPasswordComponent},
  {path:'userprojectmanage/:id',component: UserProjectManageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
