import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {ShareModule} from "../../../common/share.module";
import {VideoVersionFormComponent} from "./versionform/videoversionform.component";
import {VideoVersionManageComponent} from "./videoversionmanage.component";
import {VideoVersionManageService} from "./service/videoversionmanage.service";
import {VideoVersionManageRoutingModule} from "./videoVersionManage-routing.module";

@NgModule({
  imports: [
    CommonModule,
    VideoVersionManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    ShareModule
  ],
  declarations: [
    VideoVersionFormComponent,
    VideoVersionManageComponent,
  ],
  providers:[
    VideoVersionManageService
  ]
})
export class VideoVersionManageModule {
}
