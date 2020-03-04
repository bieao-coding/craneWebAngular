import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ShareModule} from "../../../common/share.module";
import {VideoDeviceListComponent} from "./videoDeviceList.component";
import {VideoDeviceFormComponent} from "./videoform/videoDeviceForm.component";
import {VideoDeviceListService} from "./service/videoDeviceList.service";
import {VideoDeviceListRoutingModule} from "./videoDeviceList-routing.module";

@NgModule({
  imports: [
    CommonModule,
    VideoDeviceListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    ShareModule
  ],
  declarations: [
    VideoDeviceListComponent,
    VideoDeviceFormComponent,
  ],
  providers:[
    VideoDeviceListService
  ]
})
export class VideoDeviceListModule {
}
