/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {NgModule, enableProdMode} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {RevvolveApp} from "./revvolve.app";
import {LoginComponent} from "../pages/login/login.component";
import {Utils} from "../shared/stuff/utils";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {AccountComponent} from "../pages/account/account.component";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {StaffComponent} from "../pages/staff/staff.component";
import {TermComponent} from "../pages/dashboard/terms/term.component";
import {PolicyComponent} from "../pages/dashboard/policy/policy.component";
import {HttpModule, JsonpModule} from "@angular/http";
import {RatingComponent} from "../shared/components/rating/rating.component";
import {ThanksComponent} from "../pages/survey/thanks/thanks.component";
import {StaffEditComponent} from "../pages/staff/staff.edit.component";
import {CarouselComponent} from "../shared/components/carousel/carousel.component";
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
import {MetricService} from "../services/metric/delegator";
import {MockMetricService} from "../services/metric/mock";
import {LiveMetricService} from "../services/metric/live";
import {SettingsComponent} from "../pages/settings/settings.component";
import {ServiceFactory} from "../services/service.factory";
import {SurveyService} from "../services/survey/delegator";
import {MockSurveyService} from "../services/survey/mock";
import {LiveSurveyService} from "../services/survey/live";
import {StartWithSurveyOption} from "../pages/survey/start/start.with.survey.option.component";
import {TopInfluencerComponent} from "../pages/survey/TopInfluencerComponent/top.influencer.component";
import {HandleComplaintComponent} from "../pages/survey/HandleComplaintComponent/handle.complaint.component";
import {SingleMetricComponent} from "../pages/survey/singlemetric/single.metric.component";
import {ToplineForStaffComponent} from "../pages/survey/topline.for.staff/topline.for.staff.component";
import {MultimetricComponent} from "../pages/survey/multimetric/multimetric.component";
import {RequestReviewComponent2} from "../pages/survey/RequestReviewComponent2/requestreview.component2";
import {CustomerTextEmailComponent} from "../pages/survey/RequestReviewComponent2/customer.text.email.component";
import {SReplacer} from "../pipes/sreplacer";
import {RotatingCarousel} from "../shared/components/rotatingcarousel/rotatingcarousel.component";
import {WheelComponent} from "../shared/components/wheel/wheel.component";
import {NgIdleModule, Idle} from "@ng-idle/core";
import {Config} from "../shared/config";
import {ValidationComponent} from "../shared/components/validation/validation.component";
import {PhonePipe} from "../pipes/phone";
import {DDBSessionService} from "../services/session/ddb";
import {EmailProviderService} from "../shared/service/email.provider.service";
import {AutoCompleteModule} from "../shared/components/autocomplete/autocomplete";
import {ImageMapComponent} from "../shared/components/imgmap/imgmap.component";
import {PickMetricGroups} from "../pages/survey/PickMetricGroups/pick.metricgroups.component";
import {AccountSetupService} from "../services/accountsetup/account.setup.service";
import {RevvolveCommonModule} from "../shared/revvolve.common.module";
import {CampaignService} from "../services/campaign/delegator";
import {MockCampaignService} from "../services/campaign/mock";
import {LiveCampaignService} from "../services/campaign/live";
import {DailyDataService} from "../services/reporting/delegator";
import {MockDailyDataService} from "../services/reporting/mock";
import {LiveDailyDataService} from "../services/reporting/live";
import {ChartService} from "../pages/reporting/chart.service";
import {CampaignDashboard} from "../pages/reporting/campaign.dashboard";
import {CampaignSummaryComponent} from "../pages/reporting/summary/campaign.summary.component";
import {SubjectSummaryComponent} from "../pages/reporting/summary/subject.summary.component";
import {ChartComponent} from "../pages/reporting/chart.component";
import {TopInfluencersTable} from "../pages/reporting/influencers/top.influencers.component";
import {PromoterDrilldownComponent} from "../pages/reporting/summary/promoter.drilldown.component";
import {SubjectDetailComponent} from "../pages/reporting/metricdetails/subject.detail.component";
import {LiveSessionFollowupService} from "../services/followup/live";
import {MockSessionFollowupService} from "../services/followup/mock";
import {SessionFollowupService} from "../services/followup/delegator";
import {RevvolveDatePipe} from "../pipes/date.filters";
import {FollowupPage} from "../pages/followups/followup.page";
import {SuggestionComponent} from "../shared/components/suggestions/suggestions.page";
import {HelpPage} from "../pages/dashboard/help/help.page";
import {AccountBranding} from "../pages/branding/account.branding";
import {ColorPicker} from "../shared/components/colorpicker/color.picker";
import {ColorModal} from "../shared/components/colorpicker/color.modal";
import {REVVOLVE_DIRECTIVES} from "../shared/directives/revvolve.directives";
import {SessionScrubber} from "../shared/scrubberservices/session.scrubber";
import {SessionOrthoScrubber} from "../shared/scrubberservices/session.ortho.scrubber";

enableProdMode();

@NgModule({
  declarations: [
    RevvolveApp,

    /** Directives **/
    REVVOLVE_DIRECTIVES,


    /** Pipes **/
    SReplacer,
    PhonePipe,
    RevvolveDatePipe,

    /** Shared components **/
    //HeaderComponent,
    //FooterComponent,
    CarouselComponent,
    RotatingCarousel,
    WheelComponent,
    ValidationComponent,
    ImageMapComponent,

    /** Common **/
    LoginComponent,
    CustomerTextEmailComponent,
    SuggestionComponent,
    HelpPage,
    ColorPicker,
    ColorModal,

    /** Administrative Components */
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent,
    StaffEditComponent,
    SettingsComponent,
    FollowupPage,
    AccountBranding,

    /** Survey Components */
    RatingComponent,
    ThanksComponent,
    StartWithSurveyOption,
    TopInfluencerComponent,
    HandleComplaintComponent,
    RequestReviewComponent2,
    SingleMetricComponent,
    PickStaffComponent,
    ToplineForStaffComponent,
    MultimetricComponent,
    PickMetricGroups,

    /** Reporting */
    ChartComponent,

    CampaignDashboard,
    CampaignSummaryComponent,
    TopInfluencersTable,
    SubjectSummaryComponent,
    PromoterDrilldownComponent,
    SubjectDetailComponent,

    /** Metric Management */
  ],
  imports: [
    IonicModule.forRoot(RevvolveApp, {pageTransition: 'ios'}),
    HttpModule,
    JsonpModule,
    NgIdleModule.forRoot(),
    AutoCompleteModule,
    //ReportingModule,
    RevvolveCommonModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RevvolveApp,

    /** Shared components **/
    //HeaderComponent,
    //FooterComponent,
    CarouselComponent,
    RotatingCarousel,
    WheelComponent,
    ValidationComponent,

    /** Common **/
    LoginComponent,
    CustomerTextEmailComponent,
    SuggestionComponent,
    HelpPage,
    ColorPicker,
    ColorModal,

    /** Administrative Components */
    DashboardComponent,
    AccountComponent,
    StaffComponent,
    PolicyComponent,
    TermComponent,
    StaffEditComponent,
    SettingsComponent,
    FollowupPage,
    AccountBranding,

    /** Survey Components */
    RatingComponent,
    ThanksComponent,
    StartWithSurveyOption,
    TopInfluencerComponent,
    HandleComplaintComponent,
    RequestReviewComponent2,
    SingleMetricComponent,
    PickStaffComponent,
    ToplineForStaffComponent,
    MultimetricComponent,
    PickMetricGroups,

    /** Reporting */
    ChartComponent,

    CampaignDashboard,
    CampaignSummaryComponent,
    TopInfluencersTable,
    SubjectSummaryComponent,
    PromoterDrilldownComponent,
    SubjectDetailComponent,

    /** Metric Management */
  ],
  providers: [
    { provide: Config, useClass: Config},
    { provide: Utils, useClass: Utils },
    { provide: AccessTokenService, useClass: AccessTokenService},
    //{ provide: ErrorHandler, useClass: CustomErrorHandler },
    ChartService,
    StaffService, MockStaffService, LiveStaffService,
    AccountService, MockAccountService, LiveAccountService,
    LiveSessionService, MockSessionService, SessionService,
    LiveMetricService, MockMetricService, MetricService,
    LiveSurveyService, MockSurveyService, SurveyService, DDBSessionService,
    ServiceFactory,
    EmailProviderService,
    AccountSetupService,
    SReplacer,
    RevvolveDatePipe,
    LiveCampaignService, MockCampaignService, CampaignService,
    LiveDailyDataService, MockDailyDataService, DailyDataService,
    SessionFollowupService, MockSessionFollowupService, LiveSessionFollowupService,
    Idle,
    SessionScrubber, SessionOrthoScrubber
    //ChartService
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
