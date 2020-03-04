import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UpdateComponent} from "./update.component";
import {CraneListComponent} from "./craneList/craneList.component";
import {VersionListComponent} from "./versions/versionList.component";

const routes: Routes = [
  {path:'',component:UpdateComponent},
  {path:'craneList/:projectId',component:CraneListComponent},
  {path:'versions',component:VersionListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateRoutingModule {
}
