import {Injectable} from "@angular/core";
import {Utils} from "./stuff/utils";

@Injectable()
export class Config {

  private static _baseUrl: string = "http://localhost:8090";

  /* TODO this should not be hardcoded */
  public static CUSTOMERID : string = "OMC";

  public static readonly SHOW_JOKES: boolean = true;
  public static readonly TIME_PER_JOKE: number = 10000;

  public static LAST_SWEEPSTAKE_MILLIS: number = Date.now();
  // TODO Set this to 15 * 60 * 1000 before launch.
  public static readonly MINUTES_BETWEEN_SWEEPSTAKES: number = 0;
  public static readonly TIMEOUT_AFTER_SHOWING_YOU_WON_MESSAGE: number = 5 * 60 * 1000;

  public static POOL_DATA = {
    UserPoolId : 'us-east-1_WRjTRJPkD', // Your user pool metricId here
    ClientId : 's8koda3rkc3rsjt3fdlvdnvia' // Your client metricId here
  };

  static REFRESH_ACCESS_TOKEN: number = 30 * 60 * 1000;

  static PAGE_TRANSITION_TIME: number = 1 * 1000;

  static PAGE_TRANSITION_ANIMATION: boolean = false;

  static SURVEY_PAGE_IDLE_SECONDS: number = 30;
  static SURVEY_PAGE_TIMEOUT_SECONDS: number = 30;

  static MOCK_DATA : {[key: string]: boolean} = {
    "Session": true,
    "Metric": true,
    "Account": true,
    "Staff": true,
    "Survey": true
  };

  static get baseUrl() {
    return Config._baseUrl;
  }

  static set baseUrl(url: string) {
    Config._baseUrl = url;
    Utils.log("BaseUrl set to {0} and pingUrl set to {1}", url, Config.pingUrl);
  }

  static get pingUrl() {
    return Config._baseUrl + "/api/ping";
  }

  public static isMockData(obj: any) : boolean {
    return Config.MOCK_DATA[Utils.getObjectName(obj)];
  }

  public static setUseMockData(obj:any, state: boolean) {
    Config.MOCK_DATA[Utils.getObjectName(obj)] = state;
  }
  public static flipMockData(obj: any) {
    Config.MOCK_DATA[Utils.getObjectName(obj)] = !Config.isMockData(obj);
  }

  public static useMockData(obj: any) : void {
    Config.MOCK_DATA[Utils.getObjectName(obj)] = true;
  }

  public static useLiveData(obj: any) : void {
    Config.MOCK_DATA[Utils.getObjectName(obj)] = false;
  }
}
