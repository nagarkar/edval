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
import {StartComponent} from "../pages/survey/start/start.component";
import {MetricComponentLegacy} from "../pages/survey/metric.legacy/metric.legacy.component";
import {ThanksComponent} from "../pages/survey/thanks/thanks.component";
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

import {enableProdMode} from '@angular/core';
import {HeaderComponent} from "../shared/header/header.component";
import {MetricService} from "../services/metric/delegator";
import {MockMetricService} from "../services/metric/mock";
import {LiveMetricService} from "../services/metric/live";
import {Session} from "../services/session/schema";
import {NpsTrendComponent} from "../pages/charts/nps.trend.component";
import {RevvolveMetricsComponent} from "../pages/charts/revvolve.metrics.component";
import {AllTrendsComponent} from "../pages/charts/all.trends";
import {SettingsComponent} from "../pages/settings/settings.component";
import {MetricSummaryComponent} from "../pages/metricsetup/metric.summary.component";
import {MetricDetailComponent} from "../pages/metricsetup/metric.detail.component";
import {ServiceFactory} from "../services/service.factory";
import {SurveySelectionComponent} from "../pages/survey/surveyselection/surveyselection.component";
import {SurveyService} from "../services/survey/delegator";
import {MockSurveyService} from "../services/survey/mock";
import {LiveSurveyService} from "../services/survey/live";
import {StartWithSurveyOption} from "../pages/survey/startWithSurveyOption/start.with.survey.option.component";
import {TopInfluencerComponent} from "../pages/survey/TopInfluencerComponent/top.influencer.component";
import {HandleComplaintComponent} from "../pages/survey/HandleComplaintComponent/handle.complaint.component";
import {RequestReviewComponent} from "../pages/survey/RequestReviewComponnet/requestreview.component";
import {SingleMetricComponent} from "../pages/survey/singlemetric/single.metric.component";
import {ToplineForStaffComponent} from "../pages/survey/topline.for.staff/topline.for.staff.component";
import {MultimetricComponent} from "../pages/survey/multimetric/multimetric.component";

enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    HeaderComponent,
    CarouselComponent,

    /** Administrative Components */
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent,
    StaffEditComponent,
    SettingsComponent,

    /** Survey Components */
    RatingComponent,
    SurveySelectionComponent,
    SurveyComponent,
    MetricComponentLegacy,
    ThanksComponent,
    StartComponent,
    StartWithSurveyOption,
    TopInfluencerComponent,
    HandleComplaintComponent,
    RequestReviewComponent,
    SingleMetricComponent,
    PickStaffComponent,
    FeedbackComponent,
    ToplineForStaffComponent,
    MultimetricComponent,

    /** Reporting */
    NpsTrendComponent,
    RevvolveMetricsComponent,
    AllTrendsComponent,

    /** Metric Management */
    MetricSummaryComponent,
    MetricDetailComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginComponent,
    HeaderComponent,
    CarouselComponent,

    /** Administrative Components */
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent,
    StaffEditComponent,
    SettingsComponent,

    /** Survey Components */
    RatingComponent,
    SurveySelectionComponent,
    SurveyComponent,
    MetricComponentLegacy,
    ThanksComponent,
    StartComponent,
    StartWithSurveyOption,
    TopInfluencerComponent,
    HandleComplaintComponent,
    RequestReviewComponent,
    SingleMetricComponent,
    PickStaffComponent,
    FeedbackComponent,
    ToplineForStaffComponent,
    MultimetricComponent,
    /** Reporting */
    NpsTrendComponent,
    RevvolveMetricsComponent,
    AllTrendsComponent,

    /** Metric Management */
    MetricSummaryComponent,
    MetricDetailComponent

  ],
  providers: [
    { provide: Config, useClass: Config},
    { provide: Utils, useClass: Utils },
    { provide: AccessTokenService, useClass: AccessTokenService},
    StaffService, MockStaffService, LiveStaffService,
    AccountService, MockAccountService, LiveAccountService,
    LiveSessionService, MockSessionService, SessionService,
    LiveMetricService, MockMetricService, MetricService,
    LiveSurveyService, MockSurveyService, SurveyService,
    ServiceFactory
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
