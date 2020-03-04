import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputNoSpaceDirective} from "./inputNoSpace.directive";
import {TrimPipe} from "./trimPipe";
import {BarComponent} from "./bar.component";
import {ChinaComponent} from "./china.component";
import {HomeMapComponent} from "./home-map.component";
import {LineComponent} from "./line.component";
import {PieComponent} from "./pie.component";
import {PieRateComponent} from "./pie-rate.component";
import {EqualValidator} from "./equal-validator.directive";
import {AreaComponent} from "./area.component";
import {MapComponent} from "./map.component";
import {LeastOneValidatorDirective} from "./leastOne-validator.directive";
import {PercentPipe} from "./percentPipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InputNoSpaceDirective,
    TrimPipe,
    BarComponent,
    ChinaComponent,
    HomeMapComponent,
    LineComponent,
    PieComponent,
    PieRateComponent,
    EqualValidator,
    AreaComponent,
    MapComponent,
    LeastOneValidatorDirective,
    PercentPipe
  ],
  exports:[
    InputNoSpaceDirective,
    TrimPipe,
    BarComponent,
    ChinaComponent,
    HomeMapComponent,
    LineComponent,
    PieComponent,
    PieRateComponent,
    EqualValidator,
    AreaComponent,
    MapComponent,
    LeastOneValidatorDirective,
    PercentPipe
  ]
})
export class ShareModule {
}
