import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {NoHomePageComponent} from "./noHomePage.component";
import {AuthGuard} from "../service/auth-guard";
import {UpdateModule} from "../content/device/update/update.module";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '',component:NoHomePageComponent},
      {path: 'index', loadChildren: '../content/home/home.module#HomeModule'},
      {path: 'users',canActivate: [AuthGuard], loadChildren: '../content/user/user.module#UserModule'},
      {path: 'roles',canActivate: [AuthGuard], loadChildren: '../content/role/role.module#RoleModule'},
      {path: 'menu',canActivate: [AuthGuard], loadChildren: '../content/menu/menu.module#MenuModule'},
      {path: 'companies',canActivate: [AuthGuard], loadChildren: '../content/company/company.module#CompanyModule'},
      {path: 'projects',canActivate: [AuthGuard], loadChildren: '../content/project/project.module#ProjectModule'},
      {path: 'craneFactories',canActivate: [AuthGuard], loadChildren: '../content/crane-model/crane-model.module#CraneModelModule'},
      {path: 'personals',canActivate: [AuthGuard], loadChildren: '../content/operator/operator.module#OperatorModule'},
      {path: 'craneManager',canActivate: [AuthGuard], loadChildren: '../content/crane-manage/crane-manage.module#CraneManageModule'},
      {path: 'dataMonitoring',canActivate: [AuthGuard], loadChildren: '../content/online/online.module#OnlineModule'},
      {path: 'antiDevices',canActivate: [AuthGuard], loadChildren: '../content/device/antiManage/deviceList.module#DeviceListModule'},
      {path: 'videoDevices',canActivate: [AuthGuard], loadChildren: '../content/device/videoManage/videoDeviceList.module#VideoDeviceListModule'},
      {path: 'antiVersions',canActivate: [AuthGuard], loadChildren: '../content/device/antiVersionManage/antiVersionManage.module#AntiVersionManageModule'},
      {path: 'videoVersions',canActivate: [AuthGuard], loadChildren: '../content/device/videoVersionManage/videoVersionManage.module#VideoVersionManageModule'},
      {path: 'params',canActivate: [AuthGuard], loadChildren: '../content/device/paramsProject/params.module#ParamsModule'},
      {path: 'antiUpgrade',canActivate: [AuthGuard], loadChildren: '../content/device/update/update.module#UpdateModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
