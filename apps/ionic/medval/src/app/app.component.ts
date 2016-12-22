import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {ServiceFactory} from "../services/service.factory";
import {StartWithSurveyOption} from "../pages/survey/startWithSurveyOption/start.with.survey.option.component";
import {AllPromoters, StrongDetractor, StrongPromoter,AnyDetractors} from "../services/survey/survey.functions";


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
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
