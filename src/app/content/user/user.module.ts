import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from "./user-routing.module";
import {UserManageComponent} from "./usermanage.component";
import {UserManageService} from "./service/usermanage.service";
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {ShareModule} from "../../common/share.module";
import { DropdownModule } from 'primeng/primeng';
import {UserformComponent} from "./usermanage/userform.component";
import {UserProjectManageComponent} from "./userprojectmanage/userprojectmanage.component";
import {ModifyPasswordComponent} from "./password/modifyPassword.component";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    DataTableModule,
    PaginatorModule,
    ButtonModule,
    ShareModule
  ],
  declarations: [
    UserManageComponent,
    UserformComponent,
    UserProjectManageComponent,
    ModifyPasswordComponent
  ],
  providers:[
    UserManageService
  ]
})
export class UserModule {
}
