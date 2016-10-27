//import { RouterModule }   from '@angular/router';
import { NgModule } from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginComponent } from '../pages/login/login.component';
import { Logger } from "../shared/logger.service";
import { AWSConfig } from "../shared/aws/config";
import { AccessTokenProvider } from "../shared/aws/access.token.service";
import {AccountComponent} from "../pages/account/account.component";
import {CameraImageSelector} from "../shared/stuff/camera.imageselector";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {StaffService} from "../pages/staff/service/mock.staff.service";
import {StaffComponent} from "../pages/staff/staff.component";
import {TermComponent} from "../pages/dashboard/terms/term.component";
import {PolicyComponent} from "../pages/dashboard/policy/policy.component";
import { HttpModule, JsonpModule } from '@angular/http';
import {HttpClient} from "../shared/stuff/http.client";

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardComponent,
    LoginComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent
  ],
  providers: [
    { provide: AWSConfig, useClass: AWSConfig},
    { provide: StaffService, useClass: StaffService},
    { provide: HttpClient, useClass: HttpClient},
    { provide: Logger, useClass: Logger },
    { provide: AccessTokenProvider, useClass: AccessTokenProvider},
    { provide: CameraImageSelector, useClass: CameraImageSelector},
    { provide: CameraImageSelector, useClass: CameraImageSelector},
  ]
})
export class AppModule {}

