import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {UpdateService} from "./service/update.service";
import {UpdateRoutingModule} from "./update-routing.module";
import {UpdateComponent} from "./update.component";
import {CraneListComponent} from "./craneList/craneList.component";
import {VersionListComponent} from "./versions/versionList.component";
import {VersionCenterService} from "./service/version-center.service";

@NgModule({
  imports: [
    CommonModule,
    UpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule
  ],
  declarations: [
    UpdateComponent,
    CraneListComponent,
    VersionListComponent
  ],
  providers:[
    UpdateService,
    VersionCenterService
  ]
})
export class UpdateModule {
}
