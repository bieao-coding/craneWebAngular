import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {CompanyRoutingModule} from "./company-routing.module";
import {MultiSelectModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {CompanyFormComponent} from "./companymanage/companyform.component";
import {CompanyManageComponent} from "./companymanage.component";
import {CompanyManageService} from "./service/companymanage.service";

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    MultiSelectModule,
    ShareModule
  ],
  declarations: [
    CompanyFormComponent,
    CompanyManageComponent
  ],
  providers:[
    CompanyManageService
  ]
})
export class CompanyModule {
}
