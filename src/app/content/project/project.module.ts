import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ProjectRoutingModule} from "./project-routing.module";
import {DropdownModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {ProjectManageComponent} from "./projectmanage.component";
import {ProjectFormComponent} from "./projectmanage/projectform.component";

import {ProjectManageService} from "./service/projectmanage.service";
@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    DropdownModule,
    ShareModule
  ],
  declarations: [
    ProjectManageComponent,
    ProjectFormComponent,
  ],
  providers:[
    ProjectManageService
  ]
})
export class ProjectModule {
}
