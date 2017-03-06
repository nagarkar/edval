/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Utils} from "./stuff/utils";

@Injectable()
export class Config {

  static PING_INTERVAL: number = 5 * 60 * 1000;
  static LOCALE: string = 'en-US';
  static SOFTWARE_VERSION: string = "v1.0";

  static LAST_SESSION_CREATED: number;
  static LOG_LENGTH: number = 1000;
  static ERR_LENGTH: number = 1000;

  private static _baseUrl: string = "https://localhost:8091";
  //private static _baseUrl: string = 'https://prodapi.healthcaretech.io';
  //private static _baseUrl: string = "http://34.197.108.208";
  //private static _baseUrl: string = "https://testapi.healthcaretech.io";

  static DEFAULT_CACHE_AGE: number = Infinity;

  static readonly DEFAULT_CITY_CODE = "206";

  static readonly SHOW_NEW_ACCOUNT = true;
  static readonly SHOW_FORGOT_PASSWORD = true;

  static readonly REQUEST_REVIEW_MIN_SCORE: number = 0.9;


  static CUSTOMERID : string;

  static readonly ANIMATE_MODALS = false;
  static ANIMATE_PAGE_TRANSITIONS: boolean = false;
  static PAGE_TRANSITION_TIME: number = 0.5 * 1000;

  static readonly TIME_PER_JOKE: number = 8 * 1000;

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
    LOG_BATCH_SIZE: 20
  }

  static POOL_DATA = {
    UserPoolId : Config.AWS_CONFIG.USER_POOL_ID,
    ClientId : Config.AWS_CONFIG.CLIENT_ID,
  };

  // Time between sucessful token refreshes. This should be long, typically 5 - 15 minutes.
  static ACCESS_TOKEN_REFRESH_TIME: number = 5 * 60 * 1000;

  // Time between retries for initial login. This should be short as it makes the user wait.
  static ACCESS_TOKEN_RETRY_INTERVAL_INITIAL_LOGIN: number = 3 * 1000;

  static MAX_TOKEN_REFRESH_ERRORS_BEFORE_STOP: number = 2;

  static SURVEY_PAGE_IDLE_SECONDS: number = 60;
  static SURVEY_PAGE_TIMEOUT_SECONDS: number = 60;
  static SESSION_SAVE_RETRY_TIME: number = 2 * 60 * 1000;

  static BACKOFF_MULTIPLIER: number = 2;
  static SESSION_RETRIES: number = 5;

  static MOCK_DATA : {[key: string]: boolean} = {
    "Session": false,
    "Metric": false,
    "Account": false,
    "Staff": false,
    "Campaign": false,
    "SessionFollowup": false,
    "Survey": true,
    "DailyDataList": true,
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
