import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import {InputTextareaModule} from "primeng/primeng";
import { ButtonModule } from 'primeng/primeng';
import {TreeModule} from "primeng/tree";
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ShareModule} from "../../common/share.module";
import {RoleManageComponent} from "./rolemanage.component";
import {RoleFormComponent} from "./rolemanage/roleform.component";
import {AllotAuthComponent} from "./rolemanage/allotauth.component";
import {RoleManageService} from "./service/rolemanage.service";
import {RoleRoutingModule} from "./role-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TreeModule,
    DataTableModule,
    PaginatorModule,
    ShareModule
  ],
  declarations: [
    RoleManageComponent,
    RoleFormComponent,
    AllotAuthComponent
  ],
  providers:[
    RoleManageService
  ]
})
export class RoleModule {
}
