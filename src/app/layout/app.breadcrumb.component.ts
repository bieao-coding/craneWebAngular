import { Component, OnDestroy } from '@angular/core';
import { BreadcrumbService } from '../service/breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import {Location} from "@angular/common";
import { Router } from '@angular/router';
@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {
    showBack = false;
    subscription: Subscription;

    items: MenuItem[];

    constructor(public breadcrumbService: BreadcrumbService,private location:Location,private router:Router) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
          this.items = response.slice(-2);
          this.showBack = !!this.items[0].routerLink;
        });
    }

    goBack(){
      window.history.go(-1);
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
