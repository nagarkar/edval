import {Injectable} from "@angular/core";
import {Utils} from "./stuff/utils";

@Injectable()
export class Config {

  static LAST_SESSION_CREATED: number;
  static LOG_LENGTH: number = 1000;
  static ERR_LENGTH: number = 1000;

  //private static _baseUrl: string = "https://localhost:8091";
  private static _baseUrl: string = "http://34.197.108.208";
  //private static _baseUrl: string = "https://testapi.healthcaretech.io";

  static DEFAULT_CACHE_AGE: number = Infinity;

  static readonly DEFAULT_CITY_CODE = "206";

  static readonly SHOW_NEW_ACCOUNT = false;
  static readonly SHOW_FORGOT_PASSWORD = false;
  static readonly REQUEST_REVIEW_MIN_SCORE: number = 0.9;


  static CUSTOMERID : string;

  static readonly ANIMATE_MODALS = false;
  static ANIMATE_PAGE_TRANSITIONS: boolean = false;
  static PAGE_TRANSITION_TIME: number = 1 * 1000;

  static readonly TIME_PER_JOKE: number = 10000;

  static LAST_SWEEPSTAKE_MILLIS: number = 0;
  static readonly MINUTES_BETWEEN_SWEEPSTAKES: number = 1;
  static readonly TIMEOUT_AFTER_SHOWING_YOU_WON_MESSAGE: number = 5 * 60 * 1000;
  static LAST_WIN_TIME: number;

  static readonly AWS_CONFIG = {
    REGION: 'us-east-1',
    LOG_GROUP_NAME: 'revvolve/client',
    IDENTITY_POOL_ID: 'us-east-1:ee9bbe7d-c315-4c88-baaa-4f32e1ee541d',
    USER_POOL_ID : 'us-east-1_WRjTRJPkD', // Your user pool metricId here
    CLIENT_ID: 's8koda3rkc3rsjt3fdlvdnvia', // Your client metricId here
    LOG_BATCH_SIZE: 2
  }

  static POOL_DATA = {
    UserPoolId : Config.AWS_CONFIG.USER_POOL_ID,
    ClientId : Config.AWS_CONFIG.CLIENT_ID,
  };

  static REFRESH_ACCESS_TOKEN: number = 30 * 60 * 1000;

  static SURVEY_PAGE_IDLE_SECONDS: number = 60;
  static SURVEY_PAGE_TIMEOUT_SECONDS: number = 60;

  static THANKS_PAGE_IDLE_SECONDS: number = 30;
  static THANKS_PAGE_TIMEOUT_SECONDS: number = 30;

  static REVIEW_TIME_MINUTES: number = 5;

  static MOCK_DATA : {[key: string]: boolean} = {
    "Session": false,
    "Metric": true,
    "Account": false,
    "Staff": false,
    "Survey": true,
    "Campaign": true,
  };

  static get baseUrl() {
    return Config._baseUrl;
  }

  static set baseUrl(url: string) {
    Config._baseUrl = url;
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
