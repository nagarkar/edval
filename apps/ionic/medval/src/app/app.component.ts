import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {LoginComponent} from "../pages/login/login.component";
import {StartComponent} from "../pages/survey/start/start.component";
import {NpsTrendComponent} from "../pages/charts/nps.trend.component";
import {AllTrendsComponent} from "../pages/charts/all.trends";
import {SurveyComponent} from "../pages/survey/survey.component";
import {ServiceFactory} from "../services/service.factory";
import {PickStaffComponent} from "../pages/survey/pickstaff/pickstaff.component";
import {SurveySelectionComponent} from "../pages/survey/surveyselection/surveyselection.component";
import {StartWithSurveyOption} from "../pages/survey/startWithSurveyOption/start.with.survey.option.component";
import {AllPromoters, StrongDetractor, StrongPromoter,AnyDetractors} from "../services/survey/survey.functions";
import {Utils} from "../shared/stuff/utils";


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  //rootPage = LoginComponent;
  rootPage = StartWithSurveyOption;

  constructor(platform: Platform, serviceFactory: ServiceFactory) {
    serviceFactory.resetRegisteredServices(); // this needs to be done first, esp in mock mode.
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      // This is required to make sure the class decorators run. There must be a better way to do this.
      new AllPromoters();
      new AnyDetractors();
      new StrongPromoter();
      new StrongDetractor();
      //Utils.dummyFn();
    });
  }
}
