import './polyfills.ts';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { App, Config, Form, IonicModule, Keyboard, DomController, MenuController, NavController, Platform } from 'ionic-angular';
import { ConfigMock } from './mocks';
import {Utils} from "./shared/stuff/utils";
import {AccessTokenService} from "./shared/aws/access.token.service";
import {MockStaffService} from "./services/staff/mock";
import {MockAccountService} from "./services/account/mock";
import {MockSessionService} from "./services/session/mock";
import {MockMetricService} from "./services/metric/mock";
import {MockSurveyService} from "./services/survey/mock";
import {ServiceFactory} from "./services/service.factory";
import {LiveSurveyService} from "./services/survey/live";
import {LiveMetricService} from "./services/metric/live";
import {LiveSessionService} from "./services/session/live";
import {AccountService} from "./services/account/delegator";
import {StaffService} from "./services/staff/delegator";
import {LiveStaffService} from "./services/staff/live";
import {LiveAccountService} from "./services/account/live";
import {SessionService} from "./services/session/delegator";
import {MetricService} from "./services/metric/delegator";
import {SurveyService} from "./services/survey/delegator";
import {DDBSessionService} from "./services/session/ddb";
import {RevvolveApp} from "./app/app.component";
import {HttpModule, JsonpModule} from "@angular/http";
import {NgIdleModule} from "@ng-idle/core";

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;
window['REVVOLVE_PROD_ENV'] = false;

// Prevent Karma from running prematurely.
__karma__.loaded = function (): void {
  // noop
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
let context: any = require.context('./', true, /\.spec\.ts/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();

export class TestUtils {

  public static beforeEachCompiler(components: Array<any>): Promise<{fixture: any, instance: any}> {
    return TestUtils.configureIonicTestingModule(components)
      .compileComponents().then(() => {
        let fixture: any = TestBed.createComponent(components[0]);
        return {
          fixture: fixture,
          instance: fixture.debugElement.componentInstance,
        };
      });
  }

  public static configureIonicTestingModule(components: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({
      declarations: [
        ...components,
      ],
      providers: [
        { provide: Config, useClass: Config},
        { provide: Utils, useClass: Utils },
        { provide: AccessTokenService, useClass: AccessTokenService},
        StaffService, MockStaffService, LiveStaffService,
        AccountService, MockAccountService, LiveAccountService,
        LiveSessionService, MockSessionService, SessionService,
        LiveMetricService, MockMetricService, MetricService,
        LiveSurveyService, MockSurveyService, SurveyService, DDBSessionService,
        ServiceFactory
      ],
      imports: [
        IonicModule.forRoot(RevvolveApp),
        HttpModule,
        JsonpModule,
        NgIdleModule.forRoot(),
      ],
    });
  }

  // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
  public static eventFire(el: any, etype: string): void {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      let evObj: any = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
}
