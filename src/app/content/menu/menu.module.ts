import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {MenuRoutingModule} from "./menu-routing.module";
import {TreeTableModule} from "primeng/primeng";
import {DropdownModule} from "primeng/primeng";
import {ShareModule} from "../../common/share.module";
import {MenuManageComponent} from "./menumanage.component";
import {MenuFormComponent} from "./menu-form/menu-form.component";
import {MenuService} from "./service/menu.service";

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TreeTableModule,
    ShareModule
  ],
  declarations: [
    MenuManageComponent,
    MenuFormComponent
  ],
  providers:[
    MenuService
  ]
})
export class MenuModule {
}
