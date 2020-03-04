import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OperatorFormComponent} from "./operatormanage/operatorform.component";
import {OperatorManageComponent} from "./operatormanage.component";
import {FeatureInfoComponent} from "./features/featureInfo.component";

const routes: Routes = [
  {path: '', component: OperatorManageComponent},
  {path: 'operatoradd', component: OperatorFormComponent},
  {path: 'operatoredit/:id', component: OperatorFormComponent},
  {path: 'operatorfeature/:id', component: FeatureInfoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorRoutingModule {
}
