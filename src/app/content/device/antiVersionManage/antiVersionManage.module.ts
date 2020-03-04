import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ShareModule} from "../../../common/share.module";
import {AntiVersionManageComponent} from "./antiversionmanage.component";
import {AntiVersionFormComponent} from "./versionform/antiversionform.component";
import {AntiVersionManageRoutingModule} from "./antiVersionManage-routing.module";
import {AntiVersionManageService} from "./service/antiversionmanage.service";

@NgModule({
  imports: [
    CommonModule,
    AntiVersionManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    ShareModule
  ],
  declarations: [
    AntiVersionManageComponent,
    AntiVersionFormComponent,
  ],
  providers:[
    AntiVersionManageService
  ]
})
export class AntiVersionManageModule {
}
