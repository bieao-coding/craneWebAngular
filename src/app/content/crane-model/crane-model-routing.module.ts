import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TypeListComponent} from "./typelist/typelist.component";
import {TypeListFormComponent} from "./typelist/typelistform/typelistform.component";
import {CraneTypeComponent} from "./cranetype.component";
import {CraneFormComponent} from "./cranetype/craneform.component";

const routes: Routes = [
  {path: '', component: CraneTypeComponent},
  {path: 'cranefactoryadd', component: CraneFormComponent},
  {path: 'cranefactoryedit/:id', component: CraneFormComponent},
  {path: 'typelist/:id', component: TypeListComponent},
  {path: 'typelist/:id/cranetypeadd', component: TypeListFormComponent},
  {path: 'typelist/:id/cranetypeedit/:moid', component: TypeListFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraneModelRoutingModule {
}
