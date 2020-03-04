import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/primeng';
import {CalendarModule} from "primeng/primeng";
import {CraneManageRoutingModule} from "./crane-manage-routing.module";
import {DropdownModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {OperatorsManageComponent} from "./operatorsmanage/operators-manage.component";
import {CraneListFormComponent} from "./cranelistform/cranelistform.component";
import {CraneManageComponent} from "./cranemanage.component";
import {ClockRecordComponent} from "./clockRecord/clock-record.component";
import {CraneManageService} from "./service/cranemanage.service";

@NgModule({
  imports: [
    CommonModule,
    CraneManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    ShareModule
  ],
  declarations: [
    CraneListFormComponent,
    CraneManageComponent,
    OperatorsManageComponent,
    ClockRecordComponent
  ],
  providers:[
    CraneManageService
  ]
})
export class CraneManageModule {
}
