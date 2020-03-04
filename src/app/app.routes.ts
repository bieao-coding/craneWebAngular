import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {NoFoundPageComponent} from "./noFoundPage.component";
import {EmptyPageComponent} from "./emptyPage.component";
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'empty', component: EmptyPageComponent },
  { path: 'layout', loadChildren:'./layout/layout.module#LayoutModule'},
  {path:'**',component:NoFoundPageComponent}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
