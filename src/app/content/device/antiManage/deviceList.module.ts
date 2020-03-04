import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ShareModule} from "../../../common/share.module";
import {DeviceListRoutingModule} from "./deviceList-routing.module";
import {DeviceListComponent} from "./deviceList.component";
import {DeviceFormComponent} from "./antiform/deviceForm.component";
import {DeviceListService} from "./service/deviceList.service";

@NgModule({
  imports: [
    CommonModule,
    DeviceListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    ShareModule
  ],
  declarations: [
    DeviceListComponent,
    DeviceFormComponent,
  ],
  providers:[
    DeviceListService
  ]
})
export class DeviceListModule {
}
