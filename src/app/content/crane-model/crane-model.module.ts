import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {CraneModelRoutingModule} from "./crane-model-routing.module";
import {InputTextareaModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {TypeListComponent} from "./typelist/typelist.component";
import {TypeListFormComponent} from "./typelist/typelistform/typelistform.component";
import {CraneTypeComponent} from "./cranetype.component";
import {CraneFormComponent} from "./cranetype/craneform.component";

import {CraneTypeService} from "./service/cranetype.service";

@NgModule({
  imports: [
    CommonModule,
    CraneModelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    InputTextareaModule,
    ShareModule
  ],
  declarations: [
    TypeListComponent,
    TypeListFormComponent,
    CraneTypeComponent,
    CraneFormComponent
  ],
  providers:[
    CraneTypeService
  ]
})
export class CraneModelModule {
}
