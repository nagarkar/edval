//import { RouterModule }   from '@angular/router';
import { NgModule } from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginComponent } from '../pages/login/login.component';
import { Utils } from "../shared/stuff/utils";
import { Config } from "../shared/aws/config";
import { AccessTokenService } from "../shared/aws/access.token.service";
import {AccountComponent} from "../pages/account/account.component";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {StaffComponent} from "../pages/staff/staff.component";
import {TermComponent} from "../pages/dashboard/terms/term.component";
import {PolicyComponent} from "../pages/dashboard/policy/policy.component";
import { HttpModule, JsonpModule } from '@angular/http';
import {HttpClient} from "../shared/stuff/http.client";
import {RatingComponent} from "../shared/rating/rating.component";
import {SurveyComponent} from "../pages/survey/survey.component";
import {MetricComponent} from "../pages/survey/metric/metric.component";
import {ThanksComponent} from "../pages/survey/thanks/thanks.component";
import {StartComponent} from "../pages/survey/start/start.component";
import {StaffEditComponent} from "../pages/staff/staff.edit.component";
import {CarouselComponent} from "../pages/survey/carousel/carousel.component";
import {PickStaffComponent} from "../pages/survey/pickstaff/pickstaff.component";
import {LiveStaffService} from "../services/staff/live";
import {MockStaffService} from "../services/staff/mock";
import {StaffService} from "../services/staff/delegator";
import {LiveAccountService} from "../services/account/live";
import {MockAccountService} from "../services/account/mock";
import {AccountService} from "../services/account/delegator";
import {LiveSessionService} from "../services/session/live";
import {MockSessionService} from "../services/session/mock";
import {SessionService} from "../services/session/delegator";
import {FeedbackComponent} from "../shared/feedback/feedback.component";

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent,
    RatingComponent,
    SurveyComponent,
    MetricComponent,
    ThanksComponent,
    StartComponent,
    StaffEditComponent,
    CarouselComponent,
    PickStaffComponent,
    FeedbackComponent
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
    TermComponent,
    RatingComponent,
    SurveyComponent,
    MetricComponent,
    ThanksComponent,
    StartComponent,
    StaffEditComponent,
    CarouselComponent,
    PickStaffComponent,
    FeedbackComponent
  ],
  providers: [
    { provide: Config, useClass: Config},
    { provide: HttpClient, useClass: HttpClient},
    { provide: Utils, useClass: Utils },
    { provide: AccessTokenService, useClass: AccessTokenService},
    StaffService, MockStaffService, LiveStaffService,
    AccountService, MockAccountService, LiveAccountService,
    LiveSessionService, MockSessionService, SessionService
  ]
})
export class AppModule {}

export function final(target: any, propertyKey: string) {
  const value: any = target[propertyKey];
  // if it currently has no value, then wait for the first setter-call
  // usually the case with non-static fields
  if (!value) {
    Object.defineProperty(target, propertyKey, {
      set: function (value: any) {
        Object.defineProperty(this, propertyKey, {
          get: function () {
            return value;
          },
          enumerable: true,
          configurable: false
        });
      },
      enumerable: true,
      configurable: true
    });
  } else { // else, set it immediatly
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return value;
      },
      enumerable: true
    });
  }
}
