import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(sessionStorage.getItem('menu') && sessionStorage.getItem('info')){
      const menu = JSON.parse(sessionStorage.getItem('menu')).menu;
      if(menu[route.routeConfig.path]){
        return true;
      }else{
        this.router.navigate(['/layout'])
      }
    }else{
      window.location.href = '/';
    }
  }
}
