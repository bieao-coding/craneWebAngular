import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CraneListFormComponent} from "./cranelistform/cranelistform.component";
import {CraneManageComponent} from "./cranemanage.component";
import {OperatorsManageComponent} from "./operatorsmanage/operators-manage.component";
import {ClockRecordComponent} from "./clockRecord/clock-record.component";

const routes: Routes = [
  {path: '', component: CraneManageComponent},
  {path: 'cranelist/:id/cranelistadd', component: CraneListFormComponent},
  {path: 'cranelist/:id/cranelistedit/:craneId', component: CraneListFormComponent},
  {path: 'cranelist/:id/operatormanage/:craneId', component: OperatorsManageComponent},
  {path: 'cranelist/:id/clockrecord/:craneId', component: ClockRecordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraneManageRoutingModule {
}
