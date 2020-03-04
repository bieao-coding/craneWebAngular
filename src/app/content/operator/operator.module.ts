import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import {DataTableModule} from "primeng/primeng";
import { PaginatorModule } from 'primeng/primeng';
import {OperatorRoutingModule} from "./operator-routing.module";
import {MultiSelectModule} from "primeng/primeng";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ShareModule} from "../../common/share.module";
import {OperatorFormComponent} from "./operatormanage/operatorform.component";
import {OperatorManageComponent} from "./operatormanage.component";
import {FeatureInfoComponent} from "./features/featureInfo.component";
import {OperatorManageService} from "./service/operatormanage.service";

@NgModule({
  imports: [
    CommonModule,
    OperatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    MultiSelectModule,
    OverlayPanelModule,
    ShareModule
  ],
  declarations: [
    OperatorFormComponent,
    OperatorManageComponent,
    FeatureInfoComponent
  ],
  providers:[
    OperatorManageService
  ]
})
export class OperatorModule {
}
