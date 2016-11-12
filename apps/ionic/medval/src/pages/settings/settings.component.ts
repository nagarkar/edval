

import {Component} from "@angular/core";
import {Config} from "../../shared/aws/config";
import {Session} from "../../services/session/schema";
import {Utils} from "../../shared/stuff/utils";
import {NavController} from "ionic-angular";
import {LoginComponent} from "../login/login.component";
import {Staff} from "../../services/staff/schema";
import {Metric} from "../../services/metric/schema";
import {Account} from "../../services/account/schema";
@Component({
  selector:'settings',
  templateUrl:'settings.component.html'
})

export class SettingsComponent {

  constructor(private utils: Utils, private navCtrl: NavController) {}

  get sessionIsMock() {
    return Config.isMockData(new Session());
  }

  set sessionIsMock(state: boolean) {
    Config.setUseMockData(new Session(), state);
  }

  get metricIsMock() {
    return Config.isMockData(new Metric());
  }

  set metricIsMock(state: boolean) {
    Config.setUseMockData(new Metric(), state);
  }

  get staffIsMock() {
    return Config.isMockData(new Staff());
  }

  set staffIsMock(state: boolean) {
    Config.setUseMockData(new Staff(), state);
  }

  get accountIsMock() {
    return Config.isMockData(new Account());
  }

  set accountIsMock(state: boolean) {
    Config.setUseMockData(new Account(), state);
  }

  get serviceUrl() {
    return Config.baseUrl;
  }

  set serviceUrl(url: string) {
    Config.baseUrl = url;
  }

  /*
  flipMode(key) {
    switch(key) {
      case 'session':
        Config.flipMockData(new Session());
        break;
      case 'staff':
        Config.flipMockData(new Staff());
        break;
      case 'metric':
        Config.flipMockData(new Metric());
        break;
      case 'account':
        Config.flipMockData(new Account());
        break;
      default:
         this.utils.presentInvalidEntryAlert("Unrecognized setting {0}", key);
    }
  }

  isMock(key) {
    switch(key) {
      case 'session':
        Config.isMockData(new Session());
        break;
      case 'staff':
        Config.isMockData(new Staff());
        break;
      case 'metric':
        Config.isMockData(new Metric());
        break;
      case 'account':
        Config.isMockData(new Account());
        break;
      default:
        this.utils.presentInvalidEntryAlert("Unrecognized setting {0}", key);
    }
  }
  */

  public gotoHome() {
    this.navCtrl.setRoot(LoginComponent);
  }
}
