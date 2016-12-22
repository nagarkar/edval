import {Injectable} from "@angular/core";
import {Utils} from "../stuff/utils";

@Injectable()
export class Config {

  private static _baseUrl: string = "http://localhost:8090";

  /* TODO this should not be hardcoded */
  public static CUSTOMERID : string = "";

  public static readonly TIME_OUT_AFTER_SURVEY: number = 10000;

  public static POOL_DATA = {
    UserPoolId : 'us-east-1_WRjTRJPkD', // Your user pool metricId here
    ClientId : 's8koda3rkc3rsjt3fdlvdnvia' // Your client metricId here
  };

  public static REFRESH_ACCESS_TOKEN: number = 30*60*1000;

  private static MOCK_DATA : Map<any, boolean> = new Map<any, boolean>([
    ["Session", true],
    ["Metric", true],
    ["Account", true],
    ["Staff", true],
    ["Survey", true]
  ]);

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
    return Config.MOCK_DATA.get(Utils.getObjectName(obj));
  }

  public static setUseMockData(obj:any, state: boolean) {
    Config.MOCK_DATA.set(Utils.getObjectName(obj), state);
  }
  public static flipMockData(obj: any) {
    Config.MOCK_DATA.set(Utils.getObjectName(obj), !Config.isMockData(obj));
  }

  public static useMockData(obj: any) : void {
    Config.MOCK_DATA.set(Utils.getObjectName(obj), true);
  }

  public static useLiveData(obj: any) : void {
    Config.MOCK_DATA.set(Utils.getObjectName(obj), false);
  }
}
