import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutes } from './app.routes';
import 'rxjs/add/operator/toPromise';
import { AccordionModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import {LoginComponent} from "./login/login.component";
import {NoFoundPageComponent} from "./noFoundPage.component";
import {EmptyPageComponent} from "./emptyPage.component";
import {ResolveInterceptor} from "./interceptor/resolve-interceptor";
import {LoginService} from "./service/login.service";
import {LoadingService} from "./service/loading.service";
import {MessageService} from "./service/message.service";
import {AuthGuard} from "./service/auth-guard";
import {WebSocketService} from "./service/webSocket.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule
    ],
    declarations: [
      AppComponent,
      LoginComponent,
      NoFoundPageComponent,
      EmptyPageComponent,
    ],
    providers: [
        LoginService,
        LoadingService,
        MessageService,
        WebSocketService,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: ResolveInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
