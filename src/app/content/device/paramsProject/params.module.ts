import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {DropdownModule, InputTextModule} from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {TableModule} from "primeng/table";
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ParamsRoutingModule} from "./params-routing.module";
import {SelectButtonModule} from "primeng/primeng";
import {CheckboxModule} from "primeng/primeng";
import {ParamsProjectListComponent} from "./paramsProjectList.component";
import {ParamsSettingComponent} from "./params/params-setting.component";
import {CraneGroupComponent} from "./params/craneGroup/craneGroup.component";
import {ParamsService} from "./service/params.service";
import {CenterService} from "./service/center.service";
import {PanelModule} from "primeng/panel";
import {ShareModule} from "../../../common/share.module";

@NgModule({
  imports: [
    CommonModule,
    ParamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    PanelModule,
    SelectButtonModule,
    CheckboxModule,
    ShareModule
  ],
  declarations: [
    ParamsProjectListComponent,
    ParamsSettingComponent,
    CraneGroupComponent
  ],
  providers:[
    ParamsService,
    CenterService
  ]
})
export class ParamsModule {
}
