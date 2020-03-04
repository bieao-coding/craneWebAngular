import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VideoVersionFormComponent} from "./versionform/videoversionform.component";
import {VideoVersionManageComponent} from "./videoversionmanage.component";

const routes: Routes = [
  {path: '', component: VideoVersionManageComponent},
  {path: 'add', component: VideoVersionFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoVersionManageRoutingModule {
}
